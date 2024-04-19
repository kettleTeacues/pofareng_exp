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
    >
        {props.title}
    </div>
}