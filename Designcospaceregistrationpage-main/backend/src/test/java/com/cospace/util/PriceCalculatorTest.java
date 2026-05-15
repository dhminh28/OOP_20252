package com.cospace.util;

import com.cospace.entity.HotDesk;
import com.cospace.entity.MeetingRoom;
import com.cospace.entity.PrivateOffice;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class PriceCalculatorTest {

    @Test
    void calculate_forHotDesk_usesPureHourlyPrice() {
        HotDesk hotDesk = new HotDesk();
        hotDesk.setPricePerHour(new BigDecimal("50000"));

        assertThat(PriceCalculator.calculate(hotDesk, 3)).isEqualByComparingTo("150000");
    }

    @Test
    void calculate_forMeetingRoom_appliesTenPercentDiscountWhenDurationIsAtLeastFourHours() {
        MeetingRoom meetingRoom = new MeetingRoom();
        meetingRoom.setPricePerHour(new BigDecimal("150000"));

        assertThat(PriceCalculator.calculate(meetingRoom, 3)).isEqualByComparingTo("450000");
        assertThat(PriceCalculator.calculate(meetingRoom, 4)).isEqualByComparingTo("540000");
    }

    @Test
    void calculate_forPrivateOffice_enforcesTwoHourMinimum() {
        PrivateOffice privateOffice = new PrivateOffice();
        privateOffice.setPricePerHour(new BigDecimal("200000"));

        assertThat(PriceCalculator.calculate(privateOffice, 1)).isEqualByComparingTo("400000");
        assertThat(PriceCalculator.calculate(privateOffice, 3)).isEqualByComparingTo("600000");
    }
}
