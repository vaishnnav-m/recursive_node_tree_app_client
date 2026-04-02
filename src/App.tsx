import { useEffect, useState } from "react"
import { createNode, deleteNode, getTree } from "./api/node.api";
import type { ITreeNode } from "./types/node.types";
import { TreeNode } from "./components/TreeNode";
import { PlusIcon, SpinnerIcon } from "./components/Icons";

function App() {
  const [name, setName] = useState("");
  const [tree, setTree] = useState<ITreeNode[]>([]);
  const [isLoadingTree, setIsLoadingTree] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTree = async () => {
    setIsLoadingTree(true);
    try {
      const data = await getTree();
      if (data.data) {
        setTree(data.data);
      }
    } finally {
      setIsLoadingTree(false);
    }
  }

  useEffect(() => {
    fetchTree();
  }, [])

  // Create a root node
  async function handleSubmit() {
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await createNode(name, null);
      setName("");
      await fetchTree();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Create a child node
  const handleAddNode = async (parentId: string, nodeName: string) => {
    try {
      await createNode(nodeName, parentId);
      await fetchTree();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete a child node
  const handleDeleteNode = async (nodeId: string) => {
    try {
      await deleteNode(nodeId);
      await fetchTree();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex justify-center py-8 px-4 sm:px-6 md:py-12 font-sans w-full">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[85vh] max-h-225">

        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 tracking-wide flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 shrink-0"><path d="M20 10h-4a2 2 0 0 1-2-2V4" /><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" /><polyline points="2 14 5 17 8 14" /><path d="M5 17v-5" /></svg>
            Recursive Node Tree
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 pl-8">
            Create infinite nested nodes with inline addition support.
          </p>
        </div>

        {/* Global Action Bar (Add Root Node) */}
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800 shrink-0 flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white dark:bg-gray-900">
          <div className="flex gap-2 w-full max-w-md">
            <input
              className="flex-1 px-4 py-2 text-sm bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400 transition-all outline-none shadow-sm disabled:opacity-50"
              placeholder="New root folder name..."
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              disabled={isSubmitting}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit();
              }}
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm shrink-0 min-w-25"
              onClick={handleSubmit}
              disabled={!name.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <SpinnerIcon className="w-4 h-4 mr-1.5 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <PlusIcon className="w-4 h-4 mr-1.5" />
                  Add Root
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tree Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin dark:scrollbar-thumb-gray-800 scrollbar-thumb-gray-200">
          {isLoadingTree ? (
            <div className="flex flex-col items-center justify-center h-full text-blue-500 text-sm">
              <SpinnerIcon className="w-8 h-8 animate-spin mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Loading tree structure...</p>
            </div>
          ) : tree.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
              <div className="w-16 h-16 mb-4 opacity-20">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
              </div>
              <p>No project structure found.</p>
              <p className="mt-1 opacity-70">Add a root folder to get started.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {tree.map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  onAddNode={handleAddNode}
                  onDeleteNode={handleDeleteNode}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;
