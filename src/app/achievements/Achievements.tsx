import { StyleSheet, Text, View, Button, Alert, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSQLiteContext } from 'expo-sqlite/next';
import { useUsername } from '../../utils/UserContext';

const Achievements = () => {
  const db = useSQLiteContext();
  const { xpPoints, setXpPoints } = useUsername();
  const [achievements, setAchievements] = useState([]);
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    fetchAchievements();
    fetchUserStats();
  }, []);

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

  const checkAndAwardAchievements = async () => {
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
            Alert.alert('Achievement Earned!', `You have earned the "${achievement.name}" achievement and gained ${achievement.xp_value} XP!`);
          }
        } else {
        }
      }
    } catch (error) {
      console.error('Error checking and awarding achievements:', error);
    }
  };

  const addXpPoints = async () => {
    try {
      console.log('Adding 20 XP points...');
      const newXpPoints = xpPoints + 20;
      await db.runAsync('UPDATE User SET xpPoints = ? ', [newXpPoints]);
      setXpPoints(newXpPoints);
      Alert.alert('Success', '20 XP points added!');
    } catch (error) {
      console.error('Error updating xpPoints:', error);
      Alert.alert('Error', 'Failed to add XP points.');
    }
  };

  const renderAchievement = ({ item }) => {
    let progress = 0;
    let target = 1;
    let conditionMet = false;

    switch (item.id) {
      case 1: target = 1; progress = userStats?.rental_count || 0; conditionMet = progress >= target; break;
      case 2: target = 3; progress = userStats?.rental_count || 0; conditionMet = progress >= target; break;
      case 3: target = 5; progress = userStats?.rental_count || 0; conditionMet = progress >= target; break;
      case 4: target = 10; progress = userStats?.rental_count || 0; conditionMet = progress >= target; break;
      case 5: target = 1; progress = userStats?.tenant_count || 0; conditionMet = progress >= target; break;
      case 6: target = 5; progress = userStats?.tenant_count || 0; conditionMet = progress >= target; break;
      case 7: target = 10; progress = userStats?.tenant_count || 0; conditionMet = progress >= target; break;
      case 8: target = 20; progress = userStats?.tenant_count || 0; conditionMet = progress >= target; break;
      case 9: target = 50000; progress = userStats?.annual_income || 0; conditionMet = progress >= target; break;
      case 10: target = 1000000; progress = userStats?.total_income || 0; conditionMet = progress >= target; break;
      case 11: target = 2; progress = userStats?.country_count || 0; conditionMet = progress >= target; break;
      default: break;
    }

    return (
      <View style={styles.achievementContainer}>
        <View style={styles.achievementTextContainer}>
          <Text style={styles.achievementTitle}>{item.name}</Text>
          <Text style={styles.achievementDescription}>{item.description}</Text>
          <Text style={styles.achievementProgress}>{progress}/{target} - XP: {item.xp_value}</Text>
        </View>
        {conditionMet && <Icon name="trophy" size={30} color="gold" style={styles.achievementIcon} />}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Achievements</Text>
      <Button title="Add 20 XP Points" onPress={addXpPoints} />
      <Button title="Check Achievements" onPress={checkAndAwardAchievements} />
      <FlatList
        data={achievements}
        renderItem={renderAchievement}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default Achievements;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  achievementContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  achievementTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  achievementDescription: {
    fontSize: 14,
  },
  achievementProgress: {
    fontSize: 14,
    marginTop: 5,
    color: 'gray',
  },
  achievementIcon: {
    marginLeft: 10,
  },
});
