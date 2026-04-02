import { useEffect, useState } from "react"
import { createNode, getTree } from "./api/node.api";
import type { ITreeNode } from "./types/node.types";
import { TreeNode } from "./components/TreeNode";
import { ChevronRightIcon, FolderEmptyIcon, HomeIcon, PlusIcon } from "./components/Icons";

function App() {
  const [name, setName] = useState("");
  const [tree, setTree] = useState<ITreeNode[]>([]);
  const [currentPath, setCurrentPath] = useState<{id: string, name: string}[]>([]);

  const fetchTree = () => {
    getTree().then((data) => {
      if (data.data) {
        setTree(data.data);
      }
    });
  }

  useEffect(() => {
    fetchTree();
  }, [])

  async function handleSubmit() {
    if (!name.trim()) return;
    try {
      const parentId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : "";
      await createNode(name, parentId);
      setName("");
      fetchTree();
    } catch (error) {
      console.log(error);
    }
  }

  const getCurrentFolderNodes = () => {
    if (currentPath.length === 0) return tree;
    
    const targetId = currentPath[currentPath.length - 1].id;
    let foundChildren: ITreeNode[] | null = null;
    
    const findNode = (nodes: ITreeNode[]) => {
      for (const node of nodes) {
        if (node.id === targetId) {
          foundChildren = node.children || [];
          return true;
        }
        if (node.children && node.children.length > 0) {
          if (findNode(node.children)) return true;
        }
      }
      return false;
    };

    findNode(tree);
    return foundChildren || [];
  };

  const displayNodes = getCurrentFolderNodes();

  const navigateTo = (node: ITreeNode) => {
    setCurrentPath(prev => [...prev, { id: node.id, name: node.name }]);
  };

  const navigateToBreadcrumb = (index: number) => {
    if (index === -1) {
      setCurrentPath([]);
    } else {
      setCurrentPath(prev => prev.slice(0, index + 1));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans">
      {/* Top Header / Breadcrumbs */}
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 w-full px-6 py-4 flex items-center shadow-sm">
        <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 overflow-x-auto whitespace-nowrap scrollbar-none w-full max-w-7xl mx-auto">
          <button 
            onClick={() => navigateToBreadcrumb(-1)}
            className={`flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${currentPath.length === 0 ? "text-gray-900 dark:text-white font-semibold" : ""}`}
          >
            <HomeIcon className="w-4 h-4" />
            Home
          </button>
          
          {currentPath.map((crumb, idx) => (
            <div key={crumb.id} className="flex items-center shrink-0">
              <ChevronRightIcon className="w-4 h-4 mx-1 text-gray-400" />
              <button 
                onClick={() => navigateToBreadcrumb(idx)}
                className={`px-2 py-1.5 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 max-w-[200px] truncate ${
                  idx === currentPath.length - 1 
                    ? "text-gray-900 dark:text-white font-semibold" 
                    : "hover:text-blue-600 dark:hover:text-blue-400"
                }`}
                title={crumb.name}
              >
                {crumb.name}
              </button>
            </div>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl mx-auto w-full">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white truncate">
            {currentPath.length === 0 ? "My Project" : currentPath[currentPath.length - 1].name}
          </h1>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
             <input 
                className="w-full sm:w-64 px-4 py-2.5 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-400 transition-all outline-none shadow-sm" 
                placeholder="New folder name..."
                onChange={(e) => setName(e.target.value)} 
                value={name} 
                type="text" 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
              />
              <button 
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors text-white rounded-lg px-4 py-2.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm whitespace-nowrap" 
                onClick={handleSubmit}
                disabled={!name.trim()}
              >
                <PlusIcon className="w-4 h-4 mr-1.5" />
                Create
              </button>
          </div>
        </div>

        {displayNodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 shadow-sm mt-4">
            <FolderEmptyIcon className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">This folder is empty</p>
            <p className="mt-1 text-sm">Create a new folder to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {displayNodes.map((node) => (
              <TreeNode key={node.id} node={node} onNavigate={navigateTo} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
