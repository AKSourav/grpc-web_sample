import grpc
import time
from concurrent import futures
import streaming_pb2_grpc
import streaming_pb2

class StreamingService(streaming_pb2_grpc.StreamingServiceServicer):
    def StreamData(self, request, context):
        for i in range(5):
            response = streaming_pb2.StreamResponse()
            response.message = f"Message {i} received: {request.message}"
            yield response
            time.sleep(1)
    # def StreamData(self, request_iterator, context):
    #     for request in request_iterator:
    #         response = streaming_pb2.StreamResponse()
    #         response.message = f"Received: {request.message}"
    #         yield response
    #         time.sleep(1)  # Simulate some processing time

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    streaming_pb2_grpc.add_StreamingServiceServicer_to_server(StreamingService(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("Server started. Listening on port 50051...")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
