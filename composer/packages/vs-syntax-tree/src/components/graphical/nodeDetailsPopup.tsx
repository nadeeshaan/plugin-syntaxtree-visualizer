import React, {useEffect, useState} from "react";

import { GraphicalDetailsProps, Minutiae } from "../../resources/tree-interfaces";
import * as styles from "../../styles/graphical-tree.styles";

function NodeDetails(props: GraphicalDetailsProps) {
    const [isEdgeNode, updateIsEdgeNode] = useState(false);
    const [isBottomNode, updateIsBottomNode] = useState(false);

    useEffect(() => {
        if (props.node.x + 400 > window.innerWidth) {
            updateIsEdgeNode(true);
        }

        if (props.node.y + 350 > window.innerHeight) {
            updateIsBottomNode(true);
        }
    }, []);

    const mapMinutiae = (minutiaeArray: Minutiae[]) => {
        return minutiaeArray.map((item, id) => {
            if (!item.isInvalid) {
                return <p key = {id}>
                        {item.kind}
                    </p>;
            } else {
                return ;
            }
        });
    };

    return (
        <div>
            <div
                style = {{
                    ...styles.popupArrowStyle,
                    borderBottom: isBottomNode ? "none" : "15px solid #FFFFCE",
                    borderTop: isBottomNode ? "15px solid #FFFFCE" : "none",
                    left: props.node.x + (props.node.width / 2),
                    top: isBottomNode ? (props.node.y - 15) : (props.node.y + 50),
                    transform: "translateX(-40%)"
                }}
            />
            <div
                style = {{
                    ...styles.popupBodyStyle,
                    left: props.node.x + (props.node.width / 2),
                    top: isBottomNode ? (props.node.y - 15) : (props.node.y + props.node.height + 15),
                    transform: isBottomNode ? (isEdgeNode ? "translate(-80%, -100%)" : "translate(-10%, -100%)") :
                        (isEdgeNode ? "translateX(-80%)" : "translateX(-10%)")
                }}
            >
                <p> <b>Kind :</b>  {props.node.kind}</p><hr/>

                {props.node.position &&
                    <div>
                        <p> <b>Position :</b>
                            {" (" + (props.node.position.startLine + 1) + ", "
                                + (props.node.position.startColumn + 1) + ") , ("
                                + (props.node.position.endLine + 1) + ", "
                                + (props.node.position.endColumn + 1) + ")"
                            }
                        </p> <hr/>
                    </div>
                }

                <p style = {styles.titleFontStyle}>
                    Leading Minutiae
                </p>
                {props.node.leadingMinutiae && props.node.leadingMinutiae.length  > 0 &&
                    mapMinutiae(props.node.leadingMinutiae)
                }
                {(!props.node.leadingMinutiae || props.node.leadingMinutiae.length < 1) && <p>None</p>} <hr/>

                <p style = {styles.titleFontStyle}>
                    Trailing Minutiae
                </p>
                {props.node.trailingMinutiae && props.node.trailingMinutiae.length > 0 &&
                    mapMinutiae(props.node.trailingMinutiae)
                }
                {(!props.node.trailingMinutiae || props.node.trailingMinutiae.length < 1) && <p>None</p>}
            </div>
        </div>
    );
}

export default NodeDetails;
