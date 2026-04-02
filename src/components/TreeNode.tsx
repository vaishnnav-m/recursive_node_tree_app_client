import type { ITreeNode } from "../types/node.types";
import { FolderFilledIcon } from "./Icons";

type Props = {
   node: ITreeNode;
   onNavigate: (node: ITreeNode) => void;
};

export const TreeNode = ({ node, onNavigate }: Props) => {
   return (
      <div
         className="flex flex-col items-center justify-start p-4 rounded-xl cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors group select-none border border-transparent hover:border-blue-100 dark:hover:border-gray-700"
         onClick={() => onNavigate(node)}
      >
         <FolderFilledIcon className="w-16 h-16 text-blue-500 drop-shadow-sm mb-3 group-hover:scale-105 group-hover:text-blue-600 transition-all duration-200 ease-out" />
         <span className="text-sm font-medium text-gray-700 dark:text-gray-200 text-center truncate w-full px-1" title={node.name}>
            {node.name}
         </span>
         <span className="text-xs text-gray-400 mt-1">
            {node.children?.length === 1 ? '1 item' : `${node.children?.length || 0} items`}
         </span>
      </div>
   );
};