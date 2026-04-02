import { useState } from "react";
import type { ITreeNode } from "../types/node.types";
import { ChevronRightIcon, ChevronDownIcon, FolderFilledIcon, PlusIcon, TrashIcon, SpinnerIcon } from "./Icons";
import { toast } from "react-toastify";

type Props = {
   node: ITreeNode;
   level?: number;
   onAddNode: (parentId: string, name: string) => Promise<void>;
   onDeleteNode: (nodeId: string) => Promise<void>;
};

export const TreeNode = ({ node, level = 0, onAddNode, onDeleteNode }: Props) => {
   const [expanded, setExpanded] = useState(false);
   const [isAdding, setIsAdding] = useState(false);
   const [newNodeName, setNewNodeName] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);

   const hasChildren = node.children && node.children.length > 0;

   const handleAddSubmit = async () => {
      if (!newNodeName.trim()) {
         toast.warning("Folder name cannot be empty");
         return;
      }
      setIsSubmitting(true);
      try {
         await onAddNode(node.id, newNodeName);
         setNewNodeName("");
         setIsAdding(false);
         setExpanded(true);
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleDelete = async () => {
      setIsDeleting(true);
      try {
         await onDeleteNode(node.id);
         setIsDeleting(false);
      } finally {
         setIsSubmitting(false);
      }
   }

   const paddingLeftBase = level * 24 + 16;
   const linePosition = paddingLeftBase + 12;

   return (
      <div className="flex flex-col select-none relative w-full">
         <div className="flex items-center group py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg pr-4 border border-transparent transition-colors w-full">
            <div className="flex items-center w-full" style={{ paddingLeft: `${paddingLeftBase}px` }}>
               {/* Expand Toggle */}
               <div className="w-6 h-6 flex items-center justify-center shrink-0 mr-1.5 opacity-60 hover:opacity-100 transition-opacity">
                  {hasChildren ? (
                     <button
                        onClick={(e) => {
                           e.stopPropagation();
                           setExpanded(!expanded);
                        }}
                        className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                     >
                        {expanded ? <ChevronDownIcon className="w-4 h-4 stroke-white" /> : <ChevronRightIcon className="w-4 h-4 stroke-white" />}
                     </button>
                  ) : <div className="w-6 h-6" />}
               </div>

               {/* Node Label */}
               <div
                  className="flex items-center gap-2 overflow-hidden w-full cursor-pointer py-1"
                  onClick={() => hasChildren ? setExpanded(!expanded) : null}
               >
                  <FolderFilledIcon className="w-5 h-5 shrink-0 text-blue-500" />
                  <span className="text-[15px] font-medium text-gray-700 dark:text-gray-200 truncate leading-none">
                     {node.name}
                  </span>
               </div>

               {/* Node Action (Add child) */}
               <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 shrink-0">
                  <button
                     onClick={(e) => {
                        e.stopPropagation();
                        setIsAdding(!isAdding);
                        if (!isAdding) setExpanded(true);
                     }}
                     className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                     title="Add child node"
                  >
                     <PlusIcon className="w-4 h-4" />
                  </button>
                  <button
                     onClick={(e) => {
                        e.stopPropagation();
                        handleDelete()
                     }}
                     className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-400 transition-colors"
                     title="Add child node"
                  >
                     {isDeleting ? <SpinnerIcon className="w-4 h-4 animate-spin" /> : <TrashIcon className="w-4 h-4" />}
                  </button>
               </div>
            </div>
         </div>

         {/* Inline Add Input Row */}
         {isAdding && (
            <div className="flex items-center py-2 group mb-1" style={{ paddingLeft: `${paddingLeftBase + 24 + 6}px` }}>
               <div className="w-full max-w-sm flex items-center rounded-md border border-blue-500 overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
                  <input
                     type="text"
                     className="flex-1 px-3 py-1.5 text-sm bg-transparent outline-none text-gray-800 dark:text-gray-200 disabled:opacity-50"
                     placeholder="Folder name..."
                     value={newNodeName}
                     disabled={isSubmitting}
                     onChange={(e) => setNewNodeName(e.target.value)}
                     onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddSubmit();
                        if (e.key === 'Escape') setIsAdding(false);
                     }}
                     autoFocus
                  />
                  <button
                     className="flex items-center justify-center px-3 py-1.5 bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 min-w-15"
                     onClick={handleAddSubmit}
                     disabled={!newNodeName.trim() || isSubmitting}
                  >
                     {isSubmitting ? <SpinnerIcon className="w-4 h-4 animate-spin" /> : "Add"}
                  </button>
                  <button
                     className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                     onClick={() => {
                        setIsAdding(false);
                        setNewNodeName("");
                     }}
                     disabled={isSubmitting}
                  >
                     Cancel
                  </button>
               </div>
            </div>
         )}

         {/* Children Items */}
         {expanded && hasChildren && (
            <div className="flex flex-col relative w-full mt-0.5">
               {/* Vertical guide line spanning children */}
               <div
                  className="absolute top-0 bottom-4 w-px bg-gray-200 dark:bg-gray-700 z-0 pointer-events-none"
                  style={{ left: `${linePosition}px` }}
               />
               <div className="relative z-10 w-full flex flex-col gap-0.5">
                  {node.children.map((child) => (
                     <TreeNode
                        key={child.id}
                        node={child}
                        level={level + 1}
                        onAddNode={onAddNode}
                        onDeleteNode={onDeleteNode}
                     />
                  ))}
               </div>
            </div>
         )}
      </div>
   );
};
