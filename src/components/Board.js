import React, { useState , Fragment } from "react";

import InnerBox from './InnerBox';

const Board = function(props)
{
    return(
        <div className="board">
            {/* { board.map((row) => { 
                return (
                    <React.Fragment key = {row[0].id/3}>
                    {row.map((box) => {return <InnerBox key = {box.id} value = {box.val}/> })}
                    <React.Fragment/>
                )
             })} */}

             { props.board.map((row) => {
                 return(
                     <Fragment key = {row[0].id/3 + 1}>
                         { row.map((box) => {return <InnerBox key = {box.id} value = {box.val} x = {box.x} y = {box.y} handlePlayerMove = {props.handlePlayerMove}/>}) }
                     </Fragment>
                 )
             }) }
        </div>
    )
}

export default Board;