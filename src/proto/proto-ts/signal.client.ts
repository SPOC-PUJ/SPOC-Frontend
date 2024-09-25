// @generated by protobuf-ts 2.9.4
// @generated from protobuf file "signal.proto" (package "signal", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { SignalService } from "./signal";
import type { AverageResponse } from "./signal";
import type { AverageRequest } from "./signal";
import type { FFTResponse } from "./signal";
import type { FFTRequest } from "./signal";
import type { FftConvolveResponse } from "./signal";
import type { FftConvolveRequest } from "./signal";
import type { FastWaveletTransformResponse } from "./signal";
import type { FastWaveletTransformRequest } from "./signal";
import type { FastWaveletTransformHaarResponse } from "./signal";
import type { FastWaveletTransformHaarRequest } from "./signal";
import type { IFFTResponse } from "./signal";
import type { IFFTRequest } from "./signal";
import type { FirstDifferenceResponse } from "./signal";
import type { FirstDifferenceRequest } from "./signal";
import type { RuningSumResponse } from "./signal";
import type { RuningSumRequest } from "./signal";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { MovingAverageResponse } from "./signal";
import type { MovingAverageRequest } from "./signal";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * The signal service definition.
 *
 * @generated from protobuf service signal.SignalService
 */
export interface ISignalServiceClient {
    /**
     * @generated from protobuf rpc: ComputeMovingAverage(signal.MovingAverageRequest) returns (signal.MovingAverageResponse);
     */
    computeMovingAverage(input: MovingAverageRequest, options?: RpcOptions): UnaryCall<MovingAverageRequest, MovingAverageResponse>;
    /**
     * @generated from protobuf rpc: ComputeRuningSum(signal.RuningSumRequest) returns (signal.RuningSumResponse);
     */
    computeRuningSum(input: RuningSumRequest, options?: RpcOptions): UnaryCall<RuningSumRequest, RuningSumResponse>;
    /**
     * @generated from protobuf rpc: ComputeFirstDifference(signal.FirstDifferenceRequest) returns (signal.FirstDifferenceResponse);
     */
    computeFirstDifference(input: FirstDifferenceRequest, options?: RpcOptions): UnaryCall<FirstDifferenceRequest, FirstDifferenceResponse>;
    /**
     * @generated from protobuf rpc: ComputeIFFT(signal.IFFTRequest) returns (signal.IFFTResponse);
     */
    computeIFFT(input: IFFTRequest, options?: RpcOptions): UnaryCall<IFFTRequest, IFFTResponse>;
    /**
     * @generated from protobuf rpc: ComputeFastWaveletHaar(signal.FastWaveletTransformHaarRequest) returns (signal.FastWaveletTransformHaarResponse);
     */
    computeFastWaveletHaar(input: FastWaveletTransformHaarRequest, options?: RpcOptions): UnaryCall<FastWaveletTransformHaarRequest, FastWaveletTransformHaarResponse>;
    /**
     * @generated from protobuf rpc: ComputeFastWaveletTransform(signal.FastWaveletTransformRequest) returns (signal.FastWaveletTransformResponse);
     */
    computeFastWaveletTransform(input: FastWaveletTransformRequest, options?: RpcOptions): UnaryCall<FastWaveletTransformRequest, FastWaveletTransformResponse>;
    /**
     * @generated from protobuf rpc: ComputeFftConvolve(signal.FftConvolveRequest) returns (signal.FftConvolveResponse);
     */
    computeFftConvolve(input: FftConvolveRequest, options?: RpcOptions): UnaryCall<FftConvolveRequest, FftConvolveResponse>;
    /**
     * @generated from protobuf rpc: ComputeFFT(signal.FFTRequest) returns (signal.FFTResponse);
     */
    computeFFT(input: FFTRequest, options?: RpcOptions): UnaryCall<FFTRequest, FFTResponse>;
    /**
     * @generated from protobuf rpc: ComputeAverage(signal.AverageRequest) returns (signal.AverageResponse);
     */
    computeAverage(input: AverageRequest, options?: RpcOptions): UnaryCall<AverageRequest, AverageResponse>;
}
/**
 * The signal service definition.
 *
 * @generated from protobuf service signal.SignalService
 */
export class SignalServiceClient implements ISignalServiceClient, ServiceInfo {
    typeName = SignalService.typeName;
    methods = SignalService.methods;
    options = SignalService.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: ComputeMovingAverage(signal.MovingAverageRequest) returns (signal.MovingAverageResponse);
     */
    computeMovingAverage(input: MovingAverageRequest, options?: RpcOptions): UnaryCall<MovingAverageRequest, MovingAverageResponse> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<MovingAverageRequest, MovingAverageResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: ComputeRuningSum(signal.RuningSumRequest) returns (signal.RuningSumResponse);
     */
    computeRuningSum(input: RuningSumRequest, options?: RpcOptions): UnaryCall<RuningSumRequest, RuningSumResponse> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<RuningSumRequest, RuningSumResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: ComputeFirstDifference(signal.FirstDifferenceRequest) returns (signal.FirstDifferenceResponse);
     */
    computeFirstDifference(input: FirstDifferenceRequest, options?: RpcOptions): UnaryCall<FirstDifferenceRequest, FirstDifferenceResponse> {
        const method = this.methods[2], opt = this._transport.mergeOptions(options);
        return stackIntercept<FirstDifferenceRequest, FirstDifferenceResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: ComputeIFFT(signal.IFFTRequest) returns (signal.IFFTResponse);
     */
    computeIFFT(input: IFFTRequest, options?: RpcOptions): UnaryCall<IFFTRequest, IFFTResponse> {
        const method = this.methods[3], opt = this._transport.mergeOptions(options);
        return stackIntercept<IFFTRequest, IFFTResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: ComputeFastWaveletHaar(signal.FastWaveletTransformHaarRequest) returns (signal.FastWaveletTransformHaarResponse);
     */
    computeFastWaveletHaar(input: FastWaveletTransformHaarRequest, options?: RpcOptions): UnaryCall<FastWaveletTransformHaarRequest, FastWaveletTransformHaarResponse> {
        const method = this.methods[4], opt = this._transport.mergeOptions(options);
        return stackIntercept<FastWaveletTransformHaarRequest, FastWaveletTransformHaarResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: ComputeFastWaveletTransform(signal.FastWaveletTransformRequest) returns (signal.FastWaveletTransformResponse);
     */
    computeFastWaveletTransform(input: FastWaveletTransformRequest, options?: RpcOptions): UnaryCall<FastWaveletTransformRequest, FastWaveletTransformResponse> {
        const method = this.methods[5], opt = this._transport.mergeOptions(options);
        return stackIntercept<FastWaveletTransformRequest, FastWaveletTransformResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: ComputeFftConvolve(signal.FftConvolveRequest) returns (signal.FftConvolveResponse);
     */
    computeFftConvolve(input: FftConvolveRequest, options?: RpcOptions): UnaryCall<FftConvolveRequest, FftConvolveResponse> {
        const method = this.methods[6], opt = this._transport.mergeOptions(options);
        return stackIntercept<FftConvolveRequest, FftConvolveResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: ComputeFFT(signal.FFTRequest) returns (signal.FFTResponse);
     */
    computeFFT(input: FFTRequest, options?: RpcOptions): UnaryCall<FFTRequest, FFTResponse> {
        const method = this.methods[7], opt = this._transport.mergeOptions(options);
        return stackIntercept<FFTRequest, FFTResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: ComputeAverage(signal.AverageRequest) returns (signal.AverageResponse);
     */
    computeAverage(input: AverageRequest, options?: RpcOptions): UnaryCall<AverageRequest, AverageResponse> {
        const method = this.methods[8], opt = this._transport.mergeOptions(options);
        return stackIntercept<AverageRequest, AverageResponse>("unary", this._transport, method, opt, input);
    }
}
