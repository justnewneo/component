import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisLinearLabelAlign7 = () => {
  const group = new Group({
    style: {
      width: 1000,
      height: 1000,
    },
  });

  group.appendChild(
    new Axis({
      style: {
        data: data(12),
        labelFormatter: (_: any, index: number) => 'ABC',
        style: {
          type: 'linear',
          lineLineWidth: 5,
          tickLineWidth: 5,
          labelSpacing: 5,
          tickLength: 10,
          startPos: [250, 100],
          endPos: [650, 500],
          tickDirection: 'negative',
          labelDirection: 'positive',
          labelAlign: 'horizontal',
        },
      },
    })
  );

  return group;
};
