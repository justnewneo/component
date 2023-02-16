import { Group } from '@antv/g';
import { Axis } from '../../../../src/ui/axis';
import { data } from '../../utils';

export const AxisArcDirection17 = () => {
  const group = new Group({
    style: { width: 400, height: 300 },
  });

  group.appendChild(
    new Axis({
      style: {
        data: data(12),
        style: {
          type: 'arc',
          radius: 80,
          lineLineWidth: 5,
          tickLength: 10,
          labelSpacing: 0,
          startAngle: -90,
          endAngle: 270,
          center: [150, 150],
          tickDirection: 'positive',
          labelDirection: 'positive',
          labelAlign: 'perpendicular',
        },
      },
    })
  );

  return group;
};

AxisArcDirection17.tags = ['极坐标系', '刻度朝内', '标签在内', '标签平行于刻度'];
