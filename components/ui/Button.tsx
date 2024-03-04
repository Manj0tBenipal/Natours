"use client";
import { ReactNode } from "react";
import { Button } from "@nextui-org/button";

interface ButtonOptions {
  color:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | undefined;
  variant:
    | "solid"
    | "bordered"
    | "light"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost"
    | undefined;
}

/**
 * This is a reusable button component that can be styled using options prop. The function that needs
 * to be invoked can also be passed down as a prop.
 * in case this component is to be used to style a Link the action prop can be ignored and an <a></a> tag can be passed down
 * as children to this component
 * @param { ButtonOptions } options
 * @param children
 * @param action
 * @param {String} classes classNames that needs to be passedDown to the button
 * @constructor
 */
export default function UI_Button({
  options,
  children,
  action,
  classes,
}: {
  options: ButtonOptions;
  children: ReactNode;
  action?: Function;
  classes?: string;
}) {
  return (
    <Button
      className={`${classes !== undefined ? classes : null}`}
      color={options.color}
      variant={options.variant}
      onClick={() => {
        if (action) action();
      }}
    >
      {children}
    </Button>
  );
}
