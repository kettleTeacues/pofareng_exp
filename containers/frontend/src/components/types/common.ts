import React from "react";

export interface CommonMouseEvent {
    onClick?: (event: React.MouseEvent<HTMLElement>) => void
    onMouseEnter?: (event: React.MouseEvent<HTMLElement>) => void
    onMouseLeave?: (event: React.MouseEvent<HTMLElement>) => void
    onMouseDown?: (event: React.MouseEvent<HTMLElement>) => void
    onMouseUp?: (event: React.MouseEvent<HTMLElement>) => void
    onMouseOut?: (event: React.MouseEvent<HTMLElement>) => void
    onMouseOver?: (event: React.MouseEvent<HTMLElement>) => void
    onMouseMove?: (event: React.MouseEvent<HTMLElement>) => void
}
export interface InputMouseEvents {
    onClick?: (event: React.MouseEvent<HTMLElement>) => void
    onChange?: (event: React.ChangeEvent<HTMLElement>) => void
    onkeypress?: (event: React.KeyboardEvent<HTMLElement>) => void
    onBlur?: (event: React.FocusEvent<HTMLElement>) => void
    onFocus?: (event: React.FocusEvent<HTMLElement>) => void
    onSubmit?: (event: React.FormEvent<HTMLElement>) => void
}