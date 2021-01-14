export class ErrorMessages {
  static INVALID_LABEL_ERROR = 'Prometheus metrics cannot function without label value.';
}

export class PrometheusInvalidLabelError extends Error {
  constructor() {
    super(ErrorMessages.INVALID_LABEL_ERROR);
  }
}
