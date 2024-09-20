const formatNumberOrNull = (value) => {
  if (value == null) {
    return 0;
  }
  const val = (value / 1).toFixed().replace('.', ',');
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const formatNumber = (value) => {
  const val = (value / 1).toFixed().replace('.', ',');
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const convertDate = (inputFormat, format = 'YYYY-MM-DD') => {
  function pad(s) {
    return s < 10 ? '0' + s : s;
  }
  if (inputFormat == null) {
    return '';
  }
  const d = new Date(inputFormat);
  // const time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':')
  let day = '';
  if (format === 'DD/MM/YYYY' || format === 'YYYY-MM-DD') {
    day = [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
  }
  return `${day}`;
};

const convertDateTime = (inputFormat, format = 'DD-MM-YYYY') => {
  function pad(s) {
    return s < 10 ? '0' + s : s;
  }
  const d = new Date(inputFormat);
  const time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
  const day = [pad(d.getFullYear()), pad(d.getDate()), pad(d.getMonth() + 1)].join('/');

  return [day, time];
};

function get_ranger_month(delta,date = new Date()){
  let month = date.getMonth();
  month = month - delta;
  date.setMonth(month);
  let date_from = `${date.getFullYear()}-${date.getMonth()+1}-01 00:00:00`;
  let date_to = `${date.getFullYear()}-${date.getMonth()+1}-31 23:59:59`;
  let date_show =`${date.getMonth()+1}/${date.getFullYear()}`;
  return {
    date_from,
    date_to,
    date_show
  }
}


module.exports = {
  formatNumberOrNull,
  formatNumber,
  convertDate,
  convertDateTime,
};
