import React from "react";
import { Minutiae, TreeNodeDetailsProps } from "../tree-interfaces";

function NodeDetails(props: TreeNodeDetailsProps) {
    const mapMinutiae = (minutiaeArray: Minutiae[]) => {
        return minutiaeArray.map((item, id) => {
            return <p key = {id}>
                        {item.kind}
                    </p>;
        });
    };

    return (
        <div
            style = {{
                backgroundColor: "#faf3c0",
                borderRadius: 5,
                left: props.node.x > window.innerWidth - 50 ?
                    props.node.x - 130 :
                    props.node.x + (props.node.width / 1.25),
                minHeight: 190,
                minWidth: 150,
                padding: 10,
                position: "absolute",
                textAlign: "left",
                top: props.node.y > window.innerHeight - 250 ?
                    props.node.y - 180 :
                    props.node.y + (props.node.height / 1.25),
                zIndex: 1
            }}
        >
            <p> <b>Kind :</b> {props.node.kind}</p> <hr/>

            <p style = {{fontWeight: "bold"}}>
                Leading Minutiae
            </p>
            {props.node.leadingMinutiae && props.node.leadingMinutiae.length  > 0 &&
                mapMinutiae(props.node.leadingMinutiae)
            }
            {(!props.node.leadingMinutiae || props.node.leadingMinutiae.length < 1) && <p>None</p>} <hr/>

            <p style = {{fontWeight: "bold"}}>
                Trailing Minutiae
            </p>
            {props.node.trailingMinutiae && props.node.trailingMinutiae.length > 0 &&
                mapMinutiae(props.node.trailingMinutiae)
            }
            {(!props.node.trailingMinutiae || props.node.trailingMinutiae.length < 1) && <p>None</p>}
        </div>
    );
}

export default NodeDetails;
