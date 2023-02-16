import { Group } from '@antv/g';
import { deepMix, isNil } from '@antv/util';
import { GUI, type RequiredStyleProps } from '../../core';
import { parseSeriesAttr, maybeAppend, select, subStyleProps } from '../../util';
import { Marker } from '../marker';
import type { TagStyleProps, TagOptions } from './types';

export type { TagStyleProps, TagOptions };

function adjust(container: Group, paddingLeft: number, paddingTop: number, align: string, baseline: string) {
  const bounds = container.getLocalBounds();

  let x = 0;
  let y = 0;
  if (align === 'start') x = paddingLeft;
  if (align === 'center') x = -bounds.halfExtents[0];
  if (align === 'end') x = -paddingLeft - bounds.halfExtents[0] * 2;
  if (baseline === 'top') y = paddingTop + bounds.halfExtents[1];
  if (baseline === 'middle') y = 0;
  if (baseline === 'bottom') y = paddingTop - bounds.halfExtents[1] * 2;

  container.setLocalPosition([x, y]);
}

function getTextPosition(markerShape: Marker, spacing?: number) {
  const bounds = markerShape.getLocalBounds();

  return {
    x: bounds.halfExtents[0] ? bounds.max[0] + (spacing || 0) : (markerShape.style.x as number),
    y: bounds.halfExtents[1] ? (bounds.min[1] + bounds.max[1]) / 2 : (markerShape.style.y as number),
  };
}

/**
 * 带文本、图标的 Tag 组件，支持 iconfont 组件
 *
 * 组成元素：Marker + Text + BackgroundRect
 */
export class Tag extends GUI<Required<TagStyleProps>> {
  /**
   * 标签类型
   */
  public static tag = 'tag';

  constructor(options: TagOptions) {
    super(options, {
      style: { padding: 4, spacing: 4 },
    });
  }

  public render(attributes: RequiredStyleProps<TagStyleProps>, container: Group) {
    const { padding = 0, marker, text, radius, spacing, align, verticalAlign } = attributes.style;
    const labelStyle = subStyleProps(attributes, 'label').style;
    const backgroundStyle = subStyleProps(attributes, 'background').style;
    const [pt, pr, pb, pl] = parseSeriesAttr(padding);

    const group = maybeAppend(container, '.tag-content', 'g').attr('className', 'tag-content').node();
    const style = marker ? { style: { marker } } : { style: { symbol: 'triangle', size: 0 } };
    // @ts-ignore
    const markerShape = maybeAppend(group, '.tag-marker', () => new Marker({ style }))
      .attr('className', 'tag-marker')
      .call((selection) => {
        (selection.node() as Marker).clear();
      })
      .update(style)
      .node() as Marker;

    const { x, y } = getTextPosition(markerShape, spacing);
    select(group)
      .maybeAppendByClassName('tag-text', 'text')
      .styles({
        fontFamily: 'sans-serif',
        fontSize: 12,
        text: isNil(text) ? '' : `${text}`,
        x,
        y,
        ...labelStyle,
        textBaseline: 'middle',
      })
      .call((selection) => {
        // text 为空字符串或者 false 但 textShape 依然形成了体积
        if (!text) {
          selection.remove();
        }
      });
    adjust(group, pl, pt, align || 'start', verticalAlign || 'top');

    const bounds = group.getLocalBounds();
    select(container)
      .maybeAppendByClassName('tag-background', 'rect')
      .styles({
        zIndex: (group.style.zIndex || 0) - 1,
        y: bounds.min[1] - pt,
        x: bounds.min[0] - pl,
        width: backgroundStyle !== null ? pl + pr + bounds.halfExtents[0] * 2 : 0,
        height: backgroundStyle !== null ? pt + pb + bounds.halfExtents[1] * 2 : 0,
        radius: radius ?? 2,
        fill: '#fafafa',
        stroke: '#d9d9d9',
        lineWidth: 1,
        ...backgroundStyle,
      });
  }
}
