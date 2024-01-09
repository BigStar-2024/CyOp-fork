import { useState, FC, ReactNode } from "react"

interface ITreeNode {
    title: string | ReactNode,
    defaultExpanded?: boolean,
    root?: boolean // used to check the node is root
}

export const TreeNode: FC<ITreeNode> = ({ title, defaultExpanded, children, root }) => {

    const [expanded, setExpanded] = useState<boolean>(defaultExpanded || false)

    return (
        <div className={`co-treenode ${root ? 'root' : ''}`}>
            <div className={`co-treenode-title`} onClick={() => setExpanded(!expanded)}>{title}</div>
            {expanded &&
                <div className="co-node-childs">
                    {children}
                </div>
            }
        </div>
    )
}

export default TreeNode