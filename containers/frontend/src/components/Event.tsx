import type { EventProps } from './types/calendars';

export const Events = (props: EventProps) => {
    return <div
        className={`calendar-event`}
        style={{
            background: props.color,
            marginLeft: props.marginLeft,
            marginBottom: props.marginBottom,
            marginTop: props.marginTop,
            width: props.width,
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
        {props.title}
    </div>
}