import mongoose, { Schema, Document, Types } from "mongoose";

export interface IWorkspaceMember {
  userId: Types.ObjectId;
  role: "admin" | "member";
}   

export interface IWorkspace extends Document {
  name: string;
  ownerId: Types.ObjectId;
  members: IWorkspaceMember[];
  createdAt: Date;
  updatedAt: Date;
} 

const workspaceMemberSchema = new Schema<IWorkspaceMember>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  },
});

const workspaceSchema = new Schema<IWorkspace>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [workspaceMemberSchema],
  },
  {
    timestamps: true,
  }
);

const Workspace = mongoose.model<IWorkspace>(
  "Workspace",
  workspaceSchema
);

export default Workspace;