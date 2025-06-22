<template>
  <div class="dashboard">
    <DashboardHeader />
    <div class="dashboard-content">
      <DriverDashboard v-if="isDriver" :trips="trips" />
      <PassengerDashboard v-else :trips="trips" />
    </div>
  </div>
</template>

<script>
import DashboardHeader from '@/components/DashboardHeader';
import DriverDashboard from '@/components/DriverDashboard';
import PassengerDashboard from '@/components/PassengerDashboard';
import { mapState, mapActions } from 'vuex';

export default {
  components: {
    DashboardHeader,
    DriverDashboard,
    PassengerDashboard
  },
  computed: {
    ...mapState(['isDriver', 'trips', 'user'])
  },
  created() {
    this.initializeDashboard();
  },
  methods: {
    ...mapActions(['fetchUserProfile', 'fetchDriverTrips', 'fetchPassengerTrips']),
    async initializeDashboard() {
      await this.fetchUserProfile();
      if (this.isDriver) {
        this.fetchDriverTrips();
      } else {
        this.fetchPassengerTrips();
      }
    }
  }
};
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.dashboard-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}
</style>