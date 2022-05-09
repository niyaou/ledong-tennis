/*
 * @Descripttion: pangoo-dm
 * @version: 1.0
 * @Author: uidq1343
 * @Date: 2022-04-19 19:24:08
 * @LastEditors: uidq1343
 * @LastEditTime: 2022-04-19 19:24:08
 * @content: edit your page content
 */
/* eslint-disable import/prefer-default-export */

interface ClassName {
  [key: string]: boolean;
}

export function classNames(classes: ClassName): string {
  return Object.entries(classes)
    .filter(([, value]) => value)
    .map(([key]) => key)
    .join(' ');
}
