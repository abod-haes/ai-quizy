/* eslint-disable @typescript-eslint/no-explicit-any */
export default function TitleRenderer({ schema }: any) {
  return (
    <div className="mb-2">
      <h2 className="text-xl font-semibold">
        {schema.props?.text || "Untitled"}
      </h2>
    </div>
  );
}
