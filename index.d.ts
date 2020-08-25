// import {TcpOptions} from '@types/prom-client';

import { HttpsOptions } from "@nestjs/common/interfaces/external/https-options.interface";

declare type StatsdOptions = TcpOptions | UdpOptions | HttpsOptions;
