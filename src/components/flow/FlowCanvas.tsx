import React, { useState } from 'react';
import {
  ArrowDown,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Sparkles,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FlowNode } from '../../types';
import { FlowNodeCard } from './FlowNodeCard';
import { FlowTestModal } from './FlowTestModal';
import { NodeDetailModal } from './NodeDetailModal';

export const FlowCanvas: React.FC = () => {
  const { flowNodes, settings } = useApp();

  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.max(0.6, Math.min(1.3, Number((prev + delta).toFixed(1)))));
  };

  const resetZoom = () => setZoomLevel(1);

  // Group nodes for layout
  const triggerNode = flowNodes.find((n) => n.id === 'node-trigger');
  const analyzeNode = flowNodes.find((n) => n.id === 'node-analyze');
  const categoryNode = flowNodes.find((n) => n.id === 'node-category');
  const priorityNode = flowNodes.find((n) => n.id === 'node-priority');
  const assignmentNode = flowNodes.find((n) => n.id === 'node-assignment');
  const conditionNode = flowNodes.find((n) => n.id === 'node-condition');
  const autoAssignNode = flowNodes.find((n) => n.id === 'node-auto-assign');
  const manualReviewNode = flowNodes.find((n) => n.id === 'node-manual-review');
  const updateTicketNode = flowNodes.find((n) => n.id === 'node-update-ticket');
  const endNode = flowNodes.find((n) => n.id === 'node-end');

  return (
    <div className="relative w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 overflow-hidden shadow-xs">
      {/* Canvas Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <button
          onClick={() => handleZoom(0.1)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <span className="text-xs font-mono px-1 text-slate-600 dark:text-slate-300">
          {Math.round(zoomLevel * 100)}%
        </span>
        <button
          onClick={() => handleZoom(-0.1)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-0.5" />
        <button
          onClick={resetZoom}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Reset Zoom"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Top Right Test Action */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setIsTestModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all hover:shadow-indigo-500/20"
        >
          <Play className="w-3.5 h-3.5" />
          Test Flow
        </button>
      </div>

      {/* Visual Canvas Area with Dot Grid */}
      <div
        className="w-full min-h-[920px] p-8 md:p-12 overflow-x-auto flex justify-center items-start"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(148, 163, 184, 0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div
          className="flex flex-col items-center transition-transform duration-150 origin-top"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* 1. Trigger */}
          {triggerNode && (
            <FlowNodeCard
              node={triggerNode}
              isSelected={selectedNode?.id === triggerNode.id}
              onClick={() => setSelectedNode(triggerNode)}
            />
          )}

          {/* Connector Down */}
          <div className="flex flex-col items-center py-2 text-slate-300 dark:text-slate-700">
            <div className="w-0.5 h-6 bg-slate-300 dark:bg-slate-700" />
            <ArrowDown className="w-3.5 h-3.5 -mt-1 text-slate-400 dark:text-slate-500" />
          </div>

          {/* 2. Analyze */}
          {analyzeNode && (
            <FlowNodeCard
              node={analyzeNode}
              isSelected={selectedNode?.id === analyzeNode.id}
              onClick={() => setSelectedNode(analyzeNode)}
            />
          )}

          <div className="flex flex-col items-center py-2 text-slate-300 dark:text-slate-700">
            <div className="w-0.5 h-6 bg-slate-300 dark:bg-slate-700" />
            <ArrowDown className="w-3.5 h-3.5 -mt-1 text-slate-400 dark:text-slate-500" />
          </div>

          {/* 3. Classify Category */}
          {categoryNode && (
            <FlowNodeCard
              node={categoryNode}
              isSelected={selectedNode?.id === categoryNode.id}
              onClick={() => setSelectedNode(categoryNode)}
            />
          )}

          <div className="flex flex-col items-center py-2 text-slate-300 dark:text-slate-700">
            <div className="w-0.5 h-6 bg-slate-300 dark:bg-slate-700" />
            <ArrowDown className="w-3.5 h-3.5 -mt-1 text-slate-400 dark:text-slate-500" />
          </div>

          {/* 4. Determine Priority */}
          {priorityNode && (
            <FlowNodeCard
              node={priorityNode}
              isSelected={selectedNode?.id === priorityNode.id}
              onClick={() => setSelectedNode(priorityNode)}
            />
          )}

          <div className="flex flex-col items-center py-2 text-slate-300 dark:text-slate-700">
            <div className="w-0.5 h-6 bg-slate-300 dark:bg-slate-700" />
            <ArrowDown className="w-3.5 h-3.5 -mt-1 text-slate-400 dark:text-slate-500" />
          </div>

          {/* 5. Select Assignment Group */}
          {assignmentNode && (
            <FlowNodeCard
              node={assignmentNode}
              isSelected={selectedNode?.id === assignmentNode.id}
              onClick={() => setSelectedNode(assignmentNode)}
            />
          )}

          <div className="flex flex-col items-center py-2 text-slate-300 dark:text-slate-700">
            <div className="w-0.5 h-6 bg-slate-300 dark:bg-slate-700" />
            <ArrowDown className="w-3.5 h-3.5 -mt-1 text-slate-400 dark:text-slate-500" />
          </div>

          {/* 6. Condition: Confidence >= 70% */}
          {conditionNode && (
            <FlowNodeCard
              node={conditionNode}
              isSelected={selectedNode?.id === conditionNode.id}
              onClick={() => setSelectedNode(conditionNode)}
            />
          )}

          {/* Branch Split Area */}
          <div className="w-full flex flex-col items-center mt-2 mb-4">
            {/* Split connectors */}
            <div className="w-[380px] sm:w-[480px] h-6 border-t-2 border-l-2 border-r-2 border-slate-300 dark:border-slate-700 rounded-t-lg relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-0.5 h-3 bg-slate-300 dark:bg-slate-700" />

              {/* Branch Labels */}
              <div className="absolute -top-3.5 left-6 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                YES (≥ {settings.confidenceThreshold}%)
              </div>
              <div className="absolute -top-3.5 right-6 bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                NO (&lt; {settings.confidenceThreshold}%)
              </div>
            </div>

            {/* Split columns */}
            <div className="w-[380px] sm:w-[540px] flex justify-between gap-6 pt-1">
              {/* Branch YES: Auto Assign */}
              <div className="flex flex-col items-center">
                <ArrowDown className="w-3.5 h-3.5 mb-1 text-slate-400 dark:text-slate-500" />
                {autoAssignNode && (
                  <FlowNodeCard
                    node={autoAssignNode}
                    isSelected={selectedNode?.id === autoAssignNode.id}
                    onClick={() => setSelectedNode(autoAssignNode)}
                  />
                )}
              </div>

              {/* Branch NO: Manual Review */}
              <div className="flex flex-col items-center">
                <ArrowDown className="w-3.5 h-3.5 mb-1 text-slate-400 dark:text-slate-500" />
                {manualReviewNode && (
                  <FlowNodeCard
                    node={manualReviewNode}
                    isSelected={selectedNode?.id === manualReviewNode.id}
                    onClick={() => setSelectedNode(manualReviewNode)}
                  />
                )}
              </div>
            </div>

            {/* Merge connectors into Update Ticket */}
            <div className="w-[380px] sm:w-[480px] h-6 border-b-2 border-l-2 border-r-2 border-slate-300 dark:border-slate-700 rounded-b-lg mt-3 relative">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0.5 h-4 bg-slate-300 dark:bg-slate-700" />
            </div>
          </div>

          <ArrowDown className="w-3.5 h-3.5 mb-2 text-slate-400 dark:text-slate-500" />

          {/* 7. Update Ticket Record */}
          {updateTicketNode && (
            <FlowNodeCard
              node={updateTicketNode}
              isSelected={selectedNode?.id === updateTicketNode.id}
              onClick={() => setSelectedNode(updateTicketNode)}
            />
          )}

          <div className="flex flex-col items-center py-2 text-slate-300 dark:text-slate-700">
            <div className="w-0.5 h-6 bg-slate-300 dark:bg-slate-700" />
            <ArrowDown className="w-3.5 h-3.5 -mt-1 text-slate-400 dark:text-slate-500" />
          </div>

          {/* 8. End */}
          {endNode && (
            <FlowNodeCard
              node={endNode}
              isSelected={selectedNode?.id === endNode.id}
              onClick={() => setSelectedNode(endNode)}
            />
          )}
        </div>
      </div>

      {/* Node Inspection Modal */}
      <NodeDetailModal
        node={selectedNode}
        isOpen={Boolean(selectedNode)}
        onClose={() => setSelectedNode(null)}
      />

      {/* Flow Test Runner Modal */}
      <FlowTestModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
      />
    </div>
  );
};
