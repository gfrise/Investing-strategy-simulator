import React from "react";

export function GenericInput({label, min, max, value, onChange}) {
    return (
        <div>
            <label>{label}</label>
            <input type="number"
                min={min}
                max={max}
                step={0.01}
                name={`${value}`}
                value={value}
                onChange={onChange}
            />
        </div>
    )
}