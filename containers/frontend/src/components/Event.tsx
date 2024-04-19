import type { EventProps } from './types/calendars';

export const Events = (props: EventProps) => {
    // 表示順を設定
    // すでに使われている表示順（行）を取得
    let usedPriority:number[] = [];
    props.events.forEach((event) => {
        if (event.priority != undefined) {
            usedPriority.push(event.priority);
        }
    });
    // 表示順が未定義のとき、未使用の表示順を設定
    props.events.forEach((event) => {
        if (event.priority != undefined) {
            return;
        } else {
            let i = 0;
            while (usedPriority.includes(i)) { i++; }
            event.priority = i;
            usedPriority.push(i);
        }
    });
    // ソート
    props.events.sort((a, b) => (a.priority || 0)  - (b.priority || 0));

    // イベントエレメントを生成
    let eventElements: JSX.Element[] = [];
    let shownPriority = 0;
    props.events.forEach((event, i) => {
        if (event.priority == undefined) { return; }

        // イベント開始日、またはprocessDateが日曜日ではないとき処理を抜ける
        if (props.date.getDate() == event.startDate.getDate()
        ||  props.date.getDay() == 0) {
        } else {
            return;
        }

        // 当日から数えて今週の残り日数を取得
        let rhightLength = 7 - props.date.getDay();
        // 当日から数えてイベントの残り日数を取得
        let dspLength = Math.ceil((event.endDate.getTime() - props.date.getTime()) / (1000*60*60*24)) + 1;

        eventElements.push(
            <div
                className={`calendar-event`}
                key={i}
                style={{
                    background: event.color,
                    marginLeft: '2%',
                    marginBottom: '1%',
                    marginTop: `${27 * (event.priority - shownPriority)}%`,
                    width: `${(100 * (dspLength <= rhightLength? dspLength: rhightLength)) - 6}%`,
                }}
            >
                {event.title}
            </div>
        );

        // 当日に表示した分の表示順を加算
        shownPriority = event.priority + 1;
    });
    return eventElements;
}