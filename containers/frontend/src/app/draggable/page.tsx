'use client';
import { Draggable } from '@shopify/draggable';

const Page = () => {
    const draggable = new Draggable(document.querySelectorAll('div'), {
        draggable: '.draggable-div',
    });

    return <div>
        <div>draggable</div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', background: 'rgb(200, 200, 200)', padding: '50px'}}>
            <div className='draggable-div' style={{width: 200, height: 200, background: 'rgb(255, 0, 0)'}}>div1</div>
            <div className='draggable-div' style={{width: 200, height: 200, background: 'rgb(0, 255, 0)'}}>div2</div>
            <div className='draggable-div' style={{width: 200, height: 200, background: 'rgb(0, 0, 255)'}}>div2</div>
        </div>
    </div>
}
export default Page;