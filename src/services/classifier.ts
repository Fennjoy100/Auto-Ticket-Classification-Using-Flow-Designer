import {
  ClassificationResult,
  ClassificationRule,
  FlowExecutionStep,
  Priority,
  SystemSettings,
} from '../types';
import { DEFAULT_RULES, DEFAULT_SETTINGS } from './storage';

// Priority keyword definitions
const PRIORITY_KEYWORDS: Record<Priority, string[]> = {
  Critical: [
    'server down',
    'system down',
    'production down',
    'security breach',
    'ransomware',
    'major outage',
    'all users affected',
    'production server',
    'emergency',
    'catastrophic',
  ],
  High: [
    'urgent',
    'critical',
    'cannot work',
    "can't work",
    'business stopped',
    'multiple users',
    'important system unavailable',
    'immediate assistance',
    'high priority',
    'blocking',
  ],
  Medium: [
    'not working',
    'error',
    'problem',
    'issue',
    'unable',
    'slow',
    'failing',
    'glitch',
    'disconnected',
    'broken',
    'freeze',
    'warning',
  ],
  Low: [
    'request',
    'information',
    'question',
    'minor',
    'general inquiry',
    'how to',
    'feedback',
    'suggestion',
    'clarification',
    'policy',
  ],
};

export class ClassifierEngine {
  /**
   * Run full classification pipeline on title + description
   */
  public static classify(
    title: string,
    description: string,
    rules: ClassificationRule[] = DEFAULT_RULES,
    settings: SystemSettings = DEFAULT_SETTINGS
  ): ClassificationResult {
    const startTime = performance.now();
    const flowSteps: FlowExecutionStep[] = [];
    const fullText = `${title || ''} ${description || ''}`.toLowerCase();
    const nowTimeStr = new Date().toLocaleTimeString();

    // Step 1: Trigger - Ticket Created
    flowSteps.push({
      stepId: 'trg-1',
      name: 'Ticket Created',
      type: 'trigger',
      status: 'success',
      input: `Ticket payload ingested (${(title || 'Untitled').slice(0, 45)}...)`,
      output: 'Pipeline triggered: event dispatched to NLP preprocessor',
      timestamp: nowTimeStr,
      durationMs: 2,
    });

    // Step 2: Action - Analyze Ticket Description
    const extractedKeywords = this.extractMatchedKeywords(fullText, rules);
    flowSteps.push({
      stepId: 'act-1',
      name: 'Analyze Ticket Description',
      type: 'action',
      status: 'success',
      input: `Payload text length: ${fullText.length} chars`,
      output:
        extractedKeywords.length > 0
          ? `Extracted ${extractedKeywords.length} token matches: [${extractedKeywords.slice(0, 5).join(', ')}]`
          : 'No recognized domain keywords identified in raw text',
      timestamp: nowTimeStr,
      durationMs: Math.floor(Math.random() * 8) + 8,
    });

    // Step 3: Action - Classify Category & Subcategory
    const activeRules = rules.filter((r) => r.isEnabled);
    let matchedRule: ClassificationRule | null = null;
    let highestScore = 0;
    let detectedKeywordsForCategory: string[] = [];

    for (const rule of activeRules) {
      let score = 0;
      const matchedForRule: string[] = [];

      for (const kw of rule.keywords) {
        const cleanKw = kw.toLowerCase().trim();
        if (!cleanKw) continue;

        // Word boundary or phrase check
        if (cleanKw.includes(' ') || cleanKw.includes('-')) {
          if (fullText.includes(cleanKw)) {
            score += 3;
            matchedForRule.push(cleanKw);
          }
        } else {
          // Single word check
          const regex = new RegExp(`\\b${cleanKw}\\b`, 'i');
          if (regex.test(fullText)) {
            score += 2;
            matchedForRule.push(cleanKw);
          }
        }
      }

      if (score > highestScore) {
        highestScore = score;
        matchedRule = rule;
        detectedKeywordsForCategory = matchedForRule;
      }
    }

    const category = matchedRule ? matchedRule.category : 'General IT';
    const subcategory = this.detectSubcategory(fullText, matchedRule);

    flowSteps.push({
      stepId: 'act-2',
      name: 'Classify Category',
      type: 'action',
      status: matchedRule ? 'success' : 'warning',
      input: `Rules evaluated: ${activeRules.length} active criteria`,
      output: matchedRule
        ? `Matched: ${category} (Subcategory: ${subcategory}) [Score: ${highestScore}]`
        : 'Defaulted to General IT (Subcategory: Other) due to low pattern affinity',
      timestamp: nowTimeStr,
      durationMs: Math.floor(Math.random() * 6) + 5,
    });

    // Step 4: Action - Determine Priority
    const { priority, matchedPriorityKeywords } = this.determinePriority(fullText, matchedRule);
    flowSteps.push({
      stepId: 'act-3',
      name: 'Determine Priority',
      type: 'action',
      status: 'success',
      input: 'Evaluated urgency and operational impact matrices',
      output:
        matchedPriorityKeywords.length > 0
          ? `Assigned: ${priority} (Signals: ${matchedPriorityKeywords.join(', ')})`
          : `Defaulted: ${priority} (No higher severity phrases found)`,
      timestamp: nowTimeStr,
      durationMs: Math.floor(Math.random() * 5) + 3,
    });

    // Step 5: Action - Select Assignment Group
    let assignmentGroup = matchedRule
      ? matchedRule.assignmentGroup
      : settings.defaultAssignmentGroup || 'Service Desk';

    flowSteps.push({
      stepId: 'act-4',
      name: 'Select Assignment Group',
      type: 'action',
      status: 'success',
      input: `Routing lookup for Category "${category}"`,
      output: `Assigned Group: ${assignmentGroup}`,
      timestamp: nowTimeStr,
      durationMs: Math.floor(Math.random() * 4) + 3,
    });

    // Calculate Confidence Score
    const allMatchedKeywords = Array.from(
      new Set([...detectedKeywordsForCategory, ...matchedPriorityKeywords])
    );
    const confidence = this.calculateConfidence(
      highestScore,
      allMatchedKeywords.length,
      Boolean(matchedRule),
      matchedPriorityKeywords.length > 0
    );

    // Step 6: Condition - Confidence >= Threshold?
    const threshold = settings.confidenceThreshold || 70;
    const passesConfidence = confidence >= threshold;

    flowSteps.push({
      stepId: 'cnd-1',
      name: `Confidence >= ${threshold}%?`,
      type: 'condition',
      status: passesConfidence ? 'success' : 'warning',
      input: `Calculated confidence score: ${confidence}% vs system threshold ${threshold}%`,
      output: passesConfidence
        ? `Branch YES: Confidence ${confidence}% meets automated assignment criterion`
        : `Branch NO: Confidence ${confidence}% is below threshold. Manual triage required`,
      timestamp: nowTimeStr,
      durationMs: 2,
    });

    // Step 7: Final Action based on Condition
    let requiresManualReview = false;
    if (passesConfidence && settings.automaticAssignmentEnabled) {
      flowSteps.push({
        stepId: 'act-5',
        name: 'Automatically Assign Ticket',
        type: 'action',
        status: 'success',
        input: `Target queue: ${assignmentGroup}`,
        output: `Ticket auto-routed to ${assignmentGroup} without human intervention`,
        timestamp: nowTimeStr,
        durationMs: Math.floor(Math.random() * 5) + 5,
      });
    } else {
      requiresManualReview = true;
      assignmentGroup = 'Service Desk';
      flowSteps.push({
        stepId: 'act-5',
        name: 'Send to Service Desk for Manual Review',
        type: 'action',
        status: 'warning',
        input: 'Low confidence score or automatic assignment disabled',
        output: 'Ticket rerouted to Service Desk manual triage queue',
        timestamp: nowTimeStr,
        durationMs: Math.floor(Math.random() * 5) + 5,
      });
    }

    const endTime = performance.now();
    const executionTimeMs = Math.round(endTime - startTime) || 18;

    return {
      category,
      subcategory,
      priority,
      assignmentGroup,
      confidence,
      matchedKeywords: allMatchedKeywords,
      executionTimeMs,
      flowSteps,
      ruleMatchedId: matchedRule ? matchedRule.id : undefined,
      requiresManualReview,
    };
  }

  /**
   * Determine priority using strict hierarchy: Critical -> High -> Medium -> Low
   */
  private static determinePriority(
    text: string,
    rule: ClassificationRule | null
  ): { priority: Priority; matchedPriorityKeywords: string[] } {
    const matchedPriorityKeywords: string[] = [];

    // Check Critical first
    for (const kw of PRIORITY_KEYWORDS.Critical) {
      if (text.includes(kw)) {
        matchedPriorityKeywords.push(kw);
      }
    }
    if (matchedPriorityKeywords.length > 0) {
      return { priority: 'Critical', matchedPriorityKeywords };
    }

    // Check High
    for (const kw of PRIORITY_KEYWORDS.High) {
      if (text.includes(kw)) {
        matchedPriorityKeywords.push(kw);
      }
    }
    if (matchedPriorityKeywords.length > 0) {
      return { priority: 'High', matchedPriorityKeywords };
    }

    // Check Medium
    for (const kw of PRIORITY_KEYWORDS.Medium) {
      if (text.includes(kw)) {
        matchedPriorityKeywords.push(kw);
      }
    }
    if (matchedPriorityKeywords.length > 0) {
      return { priority: 'Medium', matchedPriorityKeywords };
    }

    // Check Low
    for (const kw of PRIORITY_KEYWORDS.Low) {
      if (text.includes(kw)) {
        matchedPriorityKeywords.push(kw);
      }
    }
    if (matchedPriorityKeywords.length > 0) {
      return { priority: 'Low', matchedPriorityKeywords };
    }

    // Default to rule default or Medium
    return {
      priority: rule?.defaultPriority || 'Medium',
      matchedPriorityKeywords: [],
    };
  }

  /**
   * Detect best subcategory based on matched rule and keywords
   */
  private static detectSubcategory(text: string, rule: ClassificationRule | null): string {
    if (!rule || !rule.subcategories || rule.subcategories.length === 0) {
      return 'Other';
    }

    for (const sub of rule.subcategories) {
      const subLower = sub.toLowerCase();
      const parts = subLower.split(/[/,&-]/).map((p) => p.trim());
      for (const p of parts) {
        if (p.length > 2 && text.includes(p)) {
          return sub;
        }
      }
    }

    // Default to the first subcategory of the rule
    return rule.subcategories[0];
  }

  /**
   * Extract all matched keywords across active rules
   */
  private static extractMatchedKeywords(text: string, rules: ClassificationRule[]): string[] {
    const matched = new Set<string>();
    for (const rule of rules) {
      if (!rule.isEnabled) continue;
      for (const kw of rule.keywords) {
        const clean = kw.toLowerCase().trim();
        if (clean && text.includes(clean)) {
          matched.add(clean);
        }
      }
    }
    return Array.from(matched);
  }

  /**
   * Compute confidence percentage
   * Strong match: 90-100%
   * Normal match: 70-89%
   * Weak match: 50-69%
   * No clear match: Below 50%
   */
  private static calculateConfidence(
    score: number,
    keywordCount: number,
    hasRuleMatch: boolean,
    hasPriorityKeyword: boolean
  ): number {
    if (!hasRuleMatch || score === 0) {
      // Weak / No match
      const base = 35;
      const boost = Math.min(14, keywordCount * 4);
      return Math.min(49, base + boost);
    }

    let calculated = 60;

    // Keyword volume boost
    if (keywordCount >= 4) {
      calculated += 25;
    } else if (keywordCount >= 3) {
      calculated += 20;
    } else if (keywordCount === 2) {
      calculated += 15;
    } else {
      calculated += 8;
    }

    // Score intensity boost
    if (score >= 6) {
      calculated += 10;
    } else if (score >= 3) {
      calculated += 5;
    }

    // Priority signal boost
    if (hasPriorityKeyword) {
      calculated += 4;
    }

    // Normalize within bounds
    return Math.min(99, Math.max(52, calculated));
  }
}
