import type { EventProps } from './types/calendars';

const defaultSize = '94%';

export const Events = (props: EventProps) => {
    let className = `calendar-event ${props.addClass &&  props.addClass.join(' ')}`;

    return <div
        className={className}
        style={{
            width: props.width || defaultSize,
            height: props.height || defaultSize,
            background: props.color,
        }}
        onClick={props.onClick}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        onMouseDown={props.onMouseDown}
        onMouseUp={props.onMouseUp}
        onMouseOut={props.onMouseOut}
        onMouseOver={props.onMouseOver}
        onMouseMove={props.onMouseMove}
    >
        <div
            className='event-inner'
        >
            {props.title}
        </div>
    </div>
}