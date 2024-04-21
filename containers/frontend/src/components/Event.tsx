import type { EventProps } from './types/calendars';

const defaultWidth = '94%';

export const Events = (props: EventProps) => {
    let className = `calendar-event ${props.addClass &&  props.addClass.join(' ')}`;

    return <div
        className={className}
        style={{
            width: props.width || defaultWidth,
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