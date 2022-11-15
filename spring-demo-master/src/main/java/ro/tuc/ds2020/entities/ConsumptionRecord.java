package ro.tuc.ds2020.entities;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.persistence.Entity;
import java.io.Serializable;
import java.util.UUID;

@Entity
public class ConsumptionRecord implements Serializable{

    private static final long serialVersionUID = 1L;

    @Id
    @Getter
    @Setter
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Type(type = "uuid-binary")
    private UUID id;

    @Getter
    @Setter
    @ManyToOne(cascade = CascadeType.ALL, optional = false)
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    @Getter
    @Setter
    @Column(name = "time_stamp", nullable = false)
    private String description;

    @Getter
    @Setter
    @Column(name = "consumption", nullable = false)
    private double consumption;

    public ConsumptionRecord() {}

    public Device getDevice() {
        return device;
    }

    public void setDevice(Device device) {
        this.device = device;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getConsumption() {
        return consumption;
    }

    public void setConsumption(double consumption) {
        this.consumption = consumption;
    }
}
