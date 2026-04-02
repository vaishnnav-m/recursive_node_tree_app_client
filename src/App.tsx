import { useEffect, useState } from "react"
import { createNode, getTree } from "./api/node.api";
import type { ITreeNode } from "./types/node.types";
import { TreeNode } from "./components/TreeNode";

function App() {
  const [name, setName] = useState("");
  const [tree, setTree] = useState<ITreeNode[]>([])

  useEffect(() => {
    getTree().then((data) => {
      if (data.data) {
        setTree(data.data);
      }
    })
  }, [])

  async function handleSubmit() {
    try {
      await createNode(name);
      setName("")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="p-5">
      <div className="flex">
        <input className="w-xl border border-black" onChange={(e) => setName(e.target.value)} value={name} type="text" />
        <button className="bg-blue-600 text-white rounded-lg px-4 py-2 ml-2" onClick={handleSubmit}>Send</button>
      </div>
      {
        tree.map((node) => <TreeNode key={node.id} node={node} />)
      }
    </div>
  )
}

export default App
