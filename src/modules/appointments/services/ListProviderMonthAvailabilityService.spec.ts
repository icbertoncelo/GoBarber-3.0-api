import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from a provider', async () => {
    const hoursArray = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    const promises = hoursArray.map(async hour => {
      const appointment = await fakeAppointmentsRepository.create({
        provider_id: 'provider_id',
        user_id: 'user_id',
        date: new Date(2020, 4, 18, hour, 0, 0),
      });

      return appointment;
    });

    await Promise.all(promises);

    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2020, 4, 20, 8, 0, 0),
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'provider_id',
      month: 5,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 18, available: false },
        { day: 20, available: true },
      ]),
    );
  });
});
