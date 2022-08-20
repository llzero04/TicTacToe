import React from "react";

const InnerBox = function(props)
{
    const handleClick = function(e)
    {
        props.handlePlayerMove({x : props.x , y : props.y})
    }
    return(
        <div className="inner-box" onClick={(e) => handleClick(e)}>
            <div>{props.value}</div>
        </div>
    )
}

export default InnerBox;