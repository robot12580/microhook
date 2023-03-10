import { useRef } from 'react';
import { render, renderHook, screen } from '@testing-library/react';
import { useBoundingClientRect } from '../index';

describe('测试 useBoundingClientRect', () => {
  beforeAll(() => {
    window.ResizeObserver =
      window.ResizeObserver ||
      function () {
        return {
          observe: jest.fn(),
          disconnect: jest.fn(),
          unobserve: jest.fn()
        }
      };
  })
  it('获取一个元素的位置大小信息', () => {
    /** jest 环境没有 getBoundingClientRect 方法，手动模拟返回 */
    const getBoundingClientRect = jest.fn()
      .mockReturnValue({ top: 10, right: 20, bottom: 30, left: 40, height: 50, width: 60, x: 70, y: 80 });
    HTMLElement.prototype.getBoundingClientRect = getBoundingClientRect;

    render(<div className='container'>容器</div>)
    const { result } = renderHook((props) => useBoundingClientRect(props.element, props.options, props.deps), {
      initialProps: {
        element: screen.getAllByText('容器')[0],
        options: {
          observer: false
        },
        deps: []
      }
    });

    expect(getBoundingClientRect).toHaveBeenCalledTimes(1);

    const [rect] = result.current;

    expect(rect?.top).toEqual(10);
    expect(rect?.right).toEqual(20);
    expect(rect?.bottom).toEqual(30);
    expect(rect?.left).toEqual(40);
    expect(rect?.height).toEqual(50);
    expect(rect?.width).toEqual(60);
    expect(rect?.x).toEqual(70);
    expect(rect?.y).toEqual(80);
  });

  it('测试 options 和 deps 默认值', () => {
    const getBoundingClientRect = jest.fn()
      .mockReturnValue({ top: 10, right: 20, bottom: 30, left: 40, height: 50, width: 60, x: 70, y: 80 });

    HTMLElement.prototype.getBoundingClientRect = getBoundingClientRect;

    render(<div className='container'>容器</div>)
    const { result } = renderHook((props) => useBoundingClientRect(props.element), {
      initialProps: {
        element: screen.getAllByText('容器')[0]
      }
    });

    // 测试环境无 ResizeObserver, 无法调用
    expect(getBoundingClientRect).toHaveBeenCalledTimes(0);
  });

  it('测试 dom 为 null 的情况', () => {
    const getBoundingClientRect = jest.fn()
      .mockReturnValue({ top: 10, right: 20, bottom: 30, left: 40, height: 50, width: 60, x: 70, y: 80 });

    HTMLElement.prototype.getBoundingClientRect = getBoundingClientRect;

    render(<div className='container'>容器</div>)
    const { result } = renderHook((props) => useBoundingClientRect(props.element, props.options), {
      initialProps: {
        element: null,
        options: {
          observer: false
        }
      }
    });

    // 测试环境无 ResizeObserver, 无法调用
    expect(getBoundingClientRect).toHaveBeenCalledTimes(0);
  });
});