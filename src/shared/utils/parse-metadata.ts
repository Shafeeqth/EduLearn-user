import { Metadata } from '@grpc/grpc-js';

export function parseMetadata<Response extends Record<string, any>>(
  metadata: Metadata,
  config: { [K in keyof Response]: { header: string; multi?: boolean } },
): Partial<Response> {
  const result = {} as Response;

  for (const [responseKey, { header, multi }] of Object.entries(config)) {
    const key = responseKey as keyof Response;
    const values = metadata.get(header as string);
    try {
      if (!values || values.length == 0 || values[0] === 'undefined') continue;
      else if (multi) {
        result[key] = values.map((val) => JSON.parse(val.toString())) as Response[keyof Response];
      } else {
        result[key] = JSON.parse(values[0].toString());
      }
    } catch (error) {
      console.error(error);
      // throw error;
    }
  }
  return result;
}
