import React, { useState } from "react";
import { translation, PanelGroup } from "@carrier/ngecat-reactcomponents";
import "../../../App.scss";
import "./UnitCalculator.scss";
import { SameSystemConversion, unitConversionFunctions } from "@carrier/ngecat-unitsconversion";

const UnitConvertorControl = (props) => {
  const [units, setUnitState] = useState(props.unit);
  const itemLen = units.unitList.length;

  const ValueChanged = (event, unit) => {
      const code = unit.code;
      const value = event.target.value;
      units.unitList.forEach((unit) => {
        if (unit.code !== code && value !== "" && value !== 0) {
          unit.value = SameSystemConversion(code, unit.code, value, "English");
          if (unit.value === null) {
            const conversionFunction = unitConversionFunctions[code][unit.code];
            unit.value = conversionFunction(value);
          }
          unit.value = parseFloat(unit.value).toFixed(unit.decimalPoints);
        } else {
          unit.value = value;
        }
      });
      setUnitState({ ...units });
  };
  return (
    <div
      className={
        itemLen > 2
          ? "unitConvertor-control-big"
          : "unitConvertor-control"
      }
    >
      {units && units.name && (
        <PanelGroup panelName={translation(units.name)} open="true" togglePanel="false">
          {units.unitList.map((unit, index) => {
            return (
              <div
                key={index}
                className={
                  index === units.unitList.length - 1
                    ? "unitConvertor-control-textwidth-small"
                    : "unitConvertor-control-textwidth-big"
                }
              >
                <label>
                  <input
                  type="number"
                    className="unitConvertor-textbox"
                    value={unit.value}
                    name={unit.name}
                    id={unit.id}
                    key={unit.id}
                    onChange={(event)=>ValueChanged(event,unit)}
                    autoComplete="false"
                  />
                  <span> {translation(unit.name)}</span>
                  {index !== itemLen - 1 && (
                    <div id={index + "equalsTo"} className="equalsTo">
                      =
                    </div>
                  )}
                </label>
              </div>
            );
          })}
        </PanelGroup>
      )}
    </div>
  );
};
export default UnitConvertorControl;
