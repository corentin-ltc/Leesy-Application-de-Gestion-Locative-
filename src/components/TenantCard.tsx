import * as React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Tenant } from '../app/types';
import { useRouter } from 'expo-router';
import Svg, { Path } from "react-native-svg";

interface TenantCardProps {
  tenant: Tenant;
  deleteTenant: (id: number) => Promise<void>;
  handlePress: () => void;
  containerStyles?: any;
  textStyles?: any;
  isLoading?: boolean;
}

const TenantCard: React.FC<TenantCardProps> = ({
  tenant,
  deleteTenant,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      key={tenant.id}
      activeOpacity={1}
      className={'rounded-xl min-h-[62px] mt-6'} 
      style={[styles.card, containerStyles]}
    >
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => router.push({
          pathname: '../forms/EditTenant',
          params: { tenant: JSON.stringify(tenant), tenantId: tenant.id }
        })}
      >
        <Svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="30px"
          height="30px"
          viewBox="0 0 438.536 438.536"
          xmlSpace="preserve"
          enableBackground="new 0 0 438.536 438.536"
          fill={"#736ced"}
        >
          <Path d="M414.41 24.123C398.333 8.042 378.963 0 356.315 0H82.228C59.58 0 40.21 8.042 24.126 24.123 8.045 40.207.003 59.576.003 82.225v274.084c0 22.647 8.042 42.018 24.123 58.102 16.084 16.084 35.454 24.126 58.102 24.126h274.084c22.648 0 42.018-8.042 58.095-24.126 16.084-16.084 24.126-35.454 24.126-58.102V82.225c-.001-22.649-8.043-42.021-24.123-58.102zM155.316 365.445H73.089v-82.228l155.316-155.311 82.221 82.224-155.31 155.315zm199.853-199.853l-26.262 26.269-82.228-82.229 26.262-26.265c5.331-5.325 11.8-7.993 19.417-7.993 7.611 0 14.086 2.664 19.41 7.993l43.4 43.398c5.324 5.327 7.994 11.798 7.994 19.414.001 7.613-2.661 14.083-7.993 19.413z" />
          <Path d="M100.502 294.642L100.502 310.623 127.91 310.623 127.91 338.038 143.896 338.038 158.744 323.189 115.347 279.789z" />
          <Path d="M141.901 252.385c-3.237 3.23-3.521 6.084-.859 8.562 2.474 2.67 5.33 2.382 8.566-.855l83.081-83.083c3.237-3.23 3.519-6.086.855-8.561-2.478-2.667-5.328-2.383-8.562.855l-83.081 83.082z" />
        </Svg>
      </TouchableOpacity>

      <Text className={`${textStyles} font-psemibold text-lg w-48`}>
        {tenant.first_name} {tenant.last_name}
      </Text>
      <View id="Données" className='mt-4 justify-between flex-col'>
        <Text style={ styles.text }>
          Téléphone:
        </Text>
        <Text style={styles.textData}>{tenant.phone_number}</Text>
        <Text style={ styles.text }>
          Email:
        </Text>
        <Text style={styles.textData}>{tenant.email_address}</Text>
        <Text style={ styles.text }>
          Loyer: 
        </Text>
        <Text className="text-green-600">{tenant.rent_amount}€</Text>
        <Text style={ styles.text }>
          Charges: 
        </Text>
        <Text style={styles.textData}>{tenant.charges}€</Text>
        <Text style={ styles.text }>
          Dépôt de garantie:
        </Text>
        <Text style={styles.textData}>{tenant.security_deposit}€</Text>
        <Text style={ styles.text }>
          Informations supplémentaires:
        </Text>
        <Text style={styles.textData}>{tenant.additional_info}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderColor: '#000',
    marginBottom: '6.5%',
    padding: 15,
    borderRadius: 15,
    backgroundColor: "white",
    elevation: 8,
    shadowColor: "#000",
    shadowRadius: 8,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.15,
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  text: {
    fontFamily: 'Poppins-Medium',
    marginTop: 10,
  },
  textData: {
    fontFamily: 'Poppins-Regular',
  }
});

export default TenantCard;
