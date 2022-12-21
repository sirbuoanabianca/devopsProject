package ro.tuc.ds2020.dtos.builders;

import ro.tuc.ds2020.dtos.ConsumptionRecordDTO;
import ro.tuc.ds2020.dtos.DeviceDTO;
import ro.tuc.ds2020.entities.ConsumptionRecord;
import ro.tuc.ds2020.entities.Device;

public class ConsumptionRecordBuilder {

    private ConsumptionRecordBuilder() {
    }

    public static ConsumptionRecordDTO toConsumptionRecordDTO(ConsumptionRecord consumptionRecord) {
        return new ConsumptionRecordDTO(consumptionRecord.getId(),consumptionRecord.getDevice().getId(),consumptionRecord.getTimestamp(),
                consumptionRecord.getConsumption()
        );
    }


    public static ConsumptionRecord toEntity(ConsumptionRecordDTO consumptionRecordDTO) {
        return new ConsumptionRecord(consumptionRecordDTO.getId(), consumptionRecordDTO.getTimestamp(),
                consumptionRecordDTO.getConsumption());
    }
}
