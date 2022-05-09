/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-04-19 19:17:15
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-19 19:17:15
 * @content: edit your page content
 */
import React from 'react';
interface FieldNames {
    value: string;
    label: string;
    children: string;
}
interface Item {
    value?: string | number;
    label?: React.ReactText;
    disabled?: boolean;
    children?: Item[];
    [key: string]: any;
}
interface NormalizeItem extends Item {
    value: string;
    label: string;
    children?: NormalizeItem[];
}
interface Props {
    customInput?: React.ComponentType<any>;
    customInputProps?: {
        [key: string]: any;
    };
    customStyles?: {
        dropdown?: {
            className?: string;
            style?: React.CSSProperties;
        };
        dropdownMenu?: {
            className?: string;
            style?: React.CSSProperties;
        };
        dropdownMenuItem?: {
            className?: string;
            style?: React.CSSProperties;
        };
        dropdownSubitem?: {
            className?: string;
            style?: React.CSSProperties;
        };
    };
    disabled?: boolean;
    expandTrigger?: 'click' | 'hover';
    fieldNames?: FieldNames;
    items: Item[];
    onSelect?: (value: string, selectedItems: Omit<Item, 'children'>[]) => void;
    separatorIcon?: string;
    value: string;
}
declare class Cascade extends React.Component<Props> {
    static defaultProps: Partial<Props>;
    dropdownRef: React.RefObject<HTMLDivElement>;
    componentWillUnmount(): void;
    getSelectedItems: (items: Item[], selectedValue: string) => Omit<Item, 'children'>[];
    getValue: () => string | undefined;
    handleClick: () => void;
    handleSelect: (item: Item) => void;
    hideDropdownMenu: () => void;
    normalizeItem: (item: Item) => NormalizeItem;
    onClickOutside: (e: MouseEvent) => void;
    renderItems: (items: Item[]) => JSX.Element;
    renderInput: () => JSX.Element;
    render(): JSX.Element;
}
export default Cascade;
