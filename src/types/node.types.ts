export interface ITreeNode {
   id: string;
   name: string;
   parentId: string | null;
   children: ITreeNode[];
   createdAt: string;
   updatedAt: string;
}