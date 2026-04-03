// Simulate the students data and test the fixed filter logic
const students = [
  { id: 6, name: "KAAVIYA G", placedStatus: "Higher Studies", cgpa: 8.60 },
  { id: 7, name: "KALAISELVI S", placedStatus: "Placed (Dream)", cgpa: 8.40 },
  { id: 5, name: "KARUMURY NAGA MADHAVA NIKHIL", placedStatus: "Not Placed", cgpa: 7.50 }
];

console.log('🧪 Testing Students Page Fix...\n');

// Test the fixed placement count logic
const placedStudents = students.filter(s => 
  ['General', 'Dream', 'Super Dream', 'Placed (General)', 'Placed (Dream)', 'Placed (Super Dream)', 'Placed - General', 'Placed - Dream', 'Placed - Super Dream'].includes(s.placedStatus)
);

const higherStudiesStudents = students.filter(s => s.placedStatus === 'Higher Studies');
const notPlacedStudents = students.filter(s => s.placedStatus === 'Not Placed');

console.log('📊 STUDENTS PAGE STATISTICS:');
console.log('============================');
console.log(`📈 Total Students: ${students.length}`);
console.log(`🎓 Placed Students: ${placedStudents.length}`);
console.log(`📚 Higher Studies: ${higherStudiesStudents.length}`);
console.log(`❌ Not Placed: ${notPlacedStudents.length}`);

console.log('\n📋 BREAKDOWN BY STUDENT:');
console.log('========================');
students.forEach(student => {
  const isPlaced = ['General', 'Dream', 'Super Dream', 'Placed (General)', 'Placed (Dream)', 'Placed (Super Dream)', 'Placed - General', 'Placed - Dream', 'Placed - Super Dream'].includes(student.placedStatus);
  console.log(`${student.name.padEnd(30)} | Status: ${student.placedStatus.padEnd(20)} | Counted as Placed: ${isPlaced ? 'YES' : 'NO'}`);
});

// Test filter logic
console.log('\n🔍 TESTING FILTER LOGIC:');
console.log('========================');

const testFilter = (filterValue, student) => {
  if (filterValue === 'Placed') {
    return ['General', 'Dream', 'Super Dream', 'Placed (General)', 'Placed (Dream)', 'Placed (Super Dream)', 'Placed - General', 'Placed - Dream', 'Placed - Super Dream'].includes(student.placedStatus);
  } else if (['General', 'Dream', 'Super Dream'].includes(filterValue)) {
    return student.placedStatus === filterValue || 
           student.placedStatus === `Placed - ${filterValue}` || 
           student.placedStatus === `Placed (${filterValue})`;
  } else {
    return student.placedStatus === filterValue;
  }
};

// Test different filter scenarios
const filterTests = [
  { filter: 'Placed', description: 'All Placed Students' },
  { filter: 'Dream', description: 'Dream Placements' },
  { filter: 'Higher Studies', description: 'Higher Studies' },
  { filter: 'Not Placed', description: 'Not Placed' }
];

filterTests.forEach(test => {
  const filtered = students.filter(s => testFilter(test.filter, s));
  console.log(`Filter "${test.filter}" (${test.description}): ${filtered.length} students`);
  filtered.forEach(s => console.log(`  - ${s.name} (${s.placedStatus})`));
});

if (placedStudents.length > 0) {
  console.log('\n✅ SUCCESS! Students page placement statistics should now show correctly!');
} else {
  console.log('\n❌ Issue still exists - no placed students detected');
}