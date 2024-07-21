import { useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite/next';
import { useUsername } from '../../utils/UserContext';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

const useAchievements = () => {
  const db = useSQLiteContext();
  const { xpPoints, setXpPoints } = useUsername();
  const [userStats, setUserStats] = useState(null);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    fetchAchievements();
    fetchUserStats();
  }, []);

  useEffect(() => {
    if (userStats) {
      awardAchievements();
    }
  }, [userStats]);

  const fetchAchievements = async () => {
    try {
      console.log('Fetching achievements...');
      const result = await db.getAllAsync('SELECT * FROM Achievements');
      setAchievements(result);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const fetchUserStats = async () => {
    try {
      console.log('Fetching user stats...');
      const rentalCountResult = await db.getAllAsync('SELECT COUNT(*) as count FROM Rental');
      const tenantCountResult = await db.getAllAsync('SELECT COUNT(*) as count FROM Tenant');
      const incomeResult = await db.getAllAsync('SELECT SUM(amount) as total_income FROM Transactions WHERE type = "Income"');
      const countryCountResult = await db.getAllAsync('SELECT COUNT(DISTINCT country) as count FROM Rental');

      const rentals = rentalCountResult[0].count;
      const tenants = tenantCountResult[0].count;
      const totalIncome = incomeResult[0].total_income;
      const countries = countryCountResult[0].count;

      setUserStats({
        rental_count: rentals,
        tenant_count: tenants,
        total_income: totalIncome,
        country_count: countries,
        annual_income: totalIncome, // Assuming annual income is same as total income for simplicity
        no_expense_6_months: 0 // Placeholder, implement logic for no expenses in last 6 months
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const awardAchievements = async () => {
    if (!userStats) {
      return;
    }

    try {
      for (let achievement of achievements) {
        let conditionMet = false;

        switch (achievement.id) {
          case 1: conditionMet = userStats.rental_count >= 1; break;
          case 2: conditionMet = userStats.rental_count >= 3; break;
          case 3: conditionMet = userStats.rental_count >= 5; break;
          case 4: conditionMet = userStats.rental_count >= 10; break;
          case 5: conditionMet = userStats.tenant_count >= 1; break;
          case 6: conditionMet = userStats.tenant_count >= 5; break;
          case 7: conditionMet = userStats.tenant_count >= 10; break;
          case 8: conditionMet = userStats.tenant_count >= 20; break;
          case 9: conditionMet = userStats.annual_income >= 50000; break;
          case 10: conditionMet = userStats.total_income >= 1000000; break;
          case 11: conditionMet = userStats.country_count >= 2; break;
          default: break;
        }

        if (conditionMet) {
          const achievementExists = await db.getAllAsync('SELECT * FROM UserAchievements WHERE achievement_id = ?', [achievement.id]);

          if (achievementExists.length === 0) {
            await db.runAsync('INSERT INTO UserAchievements (user_id, achievement_id, date_earned) VALUES (?, ?, ?)', [1, achievement.id, Date.now()]);
            const newXpPoints = xpPoints + achievement.xp_value;
            await db.runAsync('UPDATE User SET xpPoints = ? ', [newXpPoints]);
            setXpPoints(newXpPoints);

            setTimeout(() => {
              Toast.show({
                type: 'info',
                text1: 'Nouveau succès débloqué!',
                text2: `\"${achievement.name}\" 😎`,
                visibilityTime: 4000,
                onPress: () => { router.push('../achievements/Achievements') }
              });
            }, 1000); // 1 second delay
          }
        }
      }
    } catch (error) {
      console.error('Error checking and awarding achievements:', error);
    }
  };

  return {
    userStats,
    achievements,
    fetchUserStats,
    fetchAchievements,
    awardAchievements,
  };
};

export default useAchievements;
