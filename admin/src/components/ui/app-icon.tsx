'use client';

import React from 'react';
import { Icon as IconifyIcon } from '@iconify/react';
import { cn } from '@/lib/utils';

type TIconComponentProps = {
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Type definition for icons supported by our application.
 * Can be either a React icon component, an Iconify icon name (string), 
 * or a pre-rendered React element.
 */
export type TAppIcon =
  | React.ComponentType<TIconComponentProps>
  | string
  | React.ReactNode;

export interface IAppIconProps {
  /** The icon to display. Can be a component, an Iconify icon name string, or a pre-rendered element. */
  icon: TAppIcon;
  /** Optional additional CSS classes for styling. */
  className?: string;
  /** Optional style object. */
  style?: React.CSSProperties;
}

/**
 * A centralized icon component that handles both component-based
 * and Iconify (string-based) icons seamlessly.
 */
export const AppIcon: React.FC<IAppIconProps> = ({
  icon,
  className,
  style,
}) => {
  if (!icon) return null;

  // Handle Iconify icons (string based)
  if (typeof icon === 'string') {
    return (
      <IconifyIcon
        icon={icon}
        style={style}
        className={cn('w-4 h-4 shrink-0', className)}
      />
    );
  }

  // Handle React Elements (e.g., <User />)
  if (React.isValidElement<TIconComponentProps>(icon)) {
    return React.cloneElement(icon, {
      style: { ...style, ...(icon.props.style ?? {}) },
      className: cn('w-4 h-4 shrink-0', className, icon.props.className),
    });
  }

  // Handle Component references (e.g., User, TrashIcon)
  const IconComponent = icon as React.ComponentType<TIconComponentProps>;
  return (
    <IconComponent
      style={style}
      className={cn('w-4 h-4 shrink-0', className)}
    />
  );
};
