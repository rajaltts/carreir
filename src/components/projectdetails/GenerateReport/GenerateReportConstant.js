// ToDo: remove hard-coding to create grouping dynamically as a part of US37807
const generateReportConstant = {
    PDF: "PDF",
    Word: "Word",
    Sales_Data: "Sales Data",
    EngineeringData: "EngineeringData",
    CompressorMaps: "Compressor Maps",
    LoadLineCompressorMap: "Load Line Compressor Map",
    Identifier_Type: 'Type',
    SalesFilter: {
        IsSalesReport: ['FALSE']
    },
    EngineeringFilter: {
        IsSalesReport: ['TRUE']
    },
    CompressorReportsFilter: {
        IsSalesReport: [null, 'TRUE', "BOTH", "N"]
    },
    Engineering: "Engineering",
    BatchLoadLine: "Batch Load Line"
}

export default generateReportConstant;
