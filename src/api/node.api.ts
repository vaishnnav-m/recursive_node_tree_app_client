import type { ApiResponse } from "../types/api.types";
import type { ITreeNode } from "../types/node.types";
import axiosInstance from "./axios"

export const createNode = async (name: string): Promise<ApiResponse> => {
   const res = await axiosInstance.post("/nodes", { name })
   return res.data;
}

export const getTree = async (): Promise<ApiResponse<ITreeNode[]>> => {
   const res = await axiosInstance.get("/nodes")
   return res.data;
}