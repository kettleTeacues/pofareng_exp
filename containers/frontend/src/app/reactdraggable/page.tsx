'use client';

import React, { ReactNode } from "react";
import GridLayout from "react-grid-layout";

const Page = () => {
    const layout = [
      { i: "a1", x: 0, y: 0, w: 1, h: 2, static: false },
      { i: "b2", x: 1, y: 0, w: 1, h: 2, minW: 1, maxW: 4 },
      { i: "c3", x: 4, y: 0, w: 1, h: 2 },
      { i: "c4", x: 4, y: 0, w: 1, h: 2 },
      { i: "c5", x: 4, y: 0, w: 1, h: 2 },
      { i: "c6", x: 4, y: 0, w: 1, h: 2 },
      { i: "c7", x: 4, y: 0, w: 1, h: 2 },
      { i: "c8", x: 4, y: 0, w: 1, h: 2 },
      { i: "c9", x: 4, y: 0, w: 1, h: 2 },
      { i: "c10", x: 4, y: 0, w: 1, h: 2 },
      { i: "c11", x: 4, y: 0, w: 1, h: 2 },
      { i: "c12", x: 4, y: 0, w: 1, h: 2 },
      { i: "c13", x: 4, y: 0, w: 1, h: 2 },
      { i: "c14", x: 4, y: 0, w: 1, h: 2 },
      { i: "c15", x: 4, y: 0, w: 1, h: 2 },
      { i: "c16", x: 4, y: 0, w: 1, h: 2 },
      { i: "c17", x: 4, y: 0, w: 1, h: 2 },
      { i: "c18", x: 4, y: 0, w: 1, h: 2 },
      { i: "c19", x: 4, y: 0, w: 1, h: 2 },
      { i: "c20", x: 4, y: 0, w: 1, h: 2 },
      { i: "c21", x: 4, y: 0, w: 1, h: 2 },
      { i: "c22", x: 4, y: 0, w: 1, h: 2 },
      { i: "c23", x: 4, y: 0, w: 1, h: 2 },
      { i: "c24", x: 4, y: 0, w: 1, h: 2 },
    ];

    return <GridLayout
        className="layout"
        layout={layout}
        cols={3}
        width={1200}
        style={{background: 'rgb(100, 100, 100)'}}
    >
        <div key="a1" style={{background: 'rgb(200, 200, 200)'}}>a</div>
        <div key="b2" style={{background: 'rgb(200, 200, 200)'}}>b</div>
        <div key="c3" style={{background: 'rgb(200, 200, 200)'}}>c</div>
        <div key="c4" style={{background: 'rgb(200, 200, 200)'}}>c</div>
        <div key="c5" style={{background: 'rgb(200, 200, 200)'}}>c</div>
        <div key="c6" style={{background: 'rgb(200, 200, 200)'}}>c</div>
        <div key="c7" style={{background: 'rgb(200, 200, 200)'}}>c</div>
        <div key="c8" style={{background: 'rgb(200, 200, 200)'}}>c</div>
        <div key="c9" style={{background: 'rgb(200, 200, 200)'}}>c</div>
        <div key="c10" style={{background: 'rgb(200, 200, 200)'}}>c</div>
        <div key="c11" style={{background: 'rgb(200, 200, 200)'}}>c</div>
        <div key="c12" style={{background: 'rgb(200, 200, 200)'}}>c</div>
        <div key="c13" style={{background: 'rgb(200, 200, 200)'}}>c</div>
        <div key="c14" style={{background: 'rgb(200, 200, 200)'}}>c</div>
        <div key="c15" style={{background: 'rgb(200, 200, 200)'}}>c</div>
        <div key="c16" style={{background: 'rgb(200, 200, 200)'}}>c</div>
        <div key="c17" style={{background: 'rgb(200, 200, 200)'}}>c</div>
        <div key="c18" style={{background: 'rgb(200, 200, 200)'}}>c</div>
        <div key="c19" style={{background: 'rgb(200, 200, 200)'}}>c</div>
        <div key="c20" style={{background: 'rgb(200, 200, 200)'}}>c</div>
        <div key="c21" style={{background: 'rgb(200, 200, 200)'}}>c</div>
        <div key="c22" style={{background: 'rgb(200, 200, 200)'}}>c</div>
        <div key="c23" style={{background: 'rgb(200, 200, 200)'}}>c</div>
        <div key="c24" style={{background: 'rgb(200, 200, 200)'}}>c</div>
    </GridLayout>
}

export default Page;