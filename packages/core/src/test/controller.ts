/* eslint-disable @typescript-eslint/no-empty-function */
import {Logger} from '@nestjs/common';

import {Inc} from '../decorators';

export class Controller {
  public logger = new Logger('Controller');

  private static instance: Controller;

  static getInstance(): Controller {
    if (!Controller.instance) {
      Controller.instance = new Controller();
    }
    return Controller.instance;
  }

  @Inc({labels: ['inc_metric_1']})
  incByDecorator(): void {}

  @Inc({labels: ['inc_metric_1', 'inc_metric_2']})
  incByDecoratorMultipleLabels(): void {}

  @Inc({labels: ['inc_metric_1']}, ['adapter_1'])
  incByDecoratorWithAdapterList(): void {}
}
