import { useState } from "react";
import type { ITreeNode } from "../types/node.types";

type Props = {
  node: ITreeNode;
};

export const TreeNode = ({ node }: Props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="ml-4 mt-2">
      <div className="flex items-center gap-2">
        <button onClick={() => setExpanded(!expanded)}>
          {expanded ? "-" : "+"}
        </button>
        <span>{node.name}</span>
      </div>

      {expanded && node.children.length > 0 && (
        <div className="ml-4 border-l pl-4">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};