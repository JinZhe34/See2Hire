import React, { useState } from 'react';
import { extend } from 'lodash';
import { useMutation } from '@apollo/react-hooks';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    setFirstName,
    setMiddleName,
    setLastName,
    setEmail,
    setPhone,
    setOtp,
} from '../../store/action';

import SignupView from '../../component/view/auth/signup';
import { VERIFY_NUMBER } from '../../graphql/auth/mutation';
import { styles } from './styles';

const signup = (props) => {
  const { navigation } = props;
  const [driverVerifyNumber] = useMutation(VERIFY_NUMBER);
  const [loadingScreen, setLoadingScreen] = useState(false);

  function onProcced(data) {
    // const { countryCode, phoneNumber } = data;
    // extend(data, {
    //   mobileNumber: `${countryCode}${phoneNumber}`,
    // });
    // delete data.countryCode;
    // delete data.phoneNumber;
    var formdata = new FormData();
    formdata.append("type", "talent");
    formdata.append("phone", data.phone);
    formdata.append("first_name", data.first_name);
    formdata.append("middle_name", data.middle_name);
    formdata.append("last_name", data.last_name);

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };

    fetch("http://wordpresswebsiteprogrammer.com/see2hire/api/register", requestOptions)
      .then(response => response.text())
      .then(result => {
        res = JSON.parse(result);
        console.log('result = ', res);
        if(res.status == true) {
          props.setOtp(res.opt);
          props.setFirstName(data.first_name);
          props.setMiddleName(data.middle_name);
          props.setLastName(data.last_name);
          props.setPhone(data.phone);
          navigation.navigate('SMSVerification');
        }
      })
      .catch(error => console.log('error', error));

    


    // setLoadingScreen(true);

    // driverVerifyNumber({
    //   variables: data,
    // }).then((res) => {
    //   if (res.data.driverVerifyNumber.existNumber === 'true') {
    //     navigation.navigate('Signin', { data });
    //     setLoadingScreen(false);
    //   } else {
    //     console.log(res);
    //     navigation.navigate('SMSVerification', { data });
    //     setLoadingScreen(false);
    //   }
    // }).catch((err) => {
    //   setLoadingScreen(false);
    //   // eslint-disable-next-line no-alert
    //   alert(err);
    // });
  }

  return (
    <>
      <Spinner
        visible={loadingScreen}
        textContent={'Proceeding...'}
        textStyle={styles.spinnerTextStyle}
        overlayColor="rgba(0, 0, 0, 0.5)"
      />
      <SignupView
        {...props}
        onProcced={onProcced}
      />
    </>
  );
};

const mapStateToProps = (state) => {
  const {store} = state;
  return store;
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
      setFirstName,
      setMiddleName,
      setLastName,
      setEmail,
      setPhone,
      setOtp,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(signup);
