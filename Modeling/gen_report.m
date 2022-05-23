import slreportgen.report.*
import slreportgen.finder.*
import mlreportgen.report.*
model = load_system('navigation');
rpt = slreportgen.report.Report(['sdd_'...
    get_param('navigation','Name')],'pdf');

tp = TitlePage;
tp.Title = upper(get_param(model,'Name'));
tp.Subtitle = 'System Design Description';
tp.Author = 'MathWorks';
tp.Image = Diagram(model);
append(rpt,tp);
toc = TableOfContents;
append(rpt,toc);

ch = Chapter("Title","RootSystem");
append(ch,Diagram(model));
blkFinder = BlockFinder(model);
blocks = find(blkFinder);
for block = blocks
    section = Section("Title", ...
       strrep(block.Name, newline, ' '));
    append(section,block);
    append(ch,section);
end
append(rpt,ch);

ch = Chapter("Title","Subsystems");
sysdiagFinder = SystemDiagramFinder(model);
sysdiagFinder.IncludeRoot = false;

while hasNext(sysdiagFinder)
    system = next(sysdiagFinder);
    section1 = Section("Title",system.Name);
    append(section1,system);
    
    blkFinder1 = BlockFinder(system);
    elems = find(blkFinder1);
    for elem = elems
       section2 = Section("Title",...
           strrep(elem.Name, newline, ' '));
       append(section2,elem);
       append(section1,section2);
    end
    append(ch,section1);
end
append(rpt,ch);

ch = Chapter("Title", "Stateflow Charts");
chdiagFinder = ChartDiagramFinder(model);
while hasNext(chdiagFinder) 
   chart = next(chdiagFinder); 
   section = Section("Title",chart.Name);
   append(section,chart);

   objFinder = StateflowDiagramElementFinder(chart);
   sfObjects = find(objFinder);
   for sfObj = sfObjects
       title = sfObj.Name;
       if isempty(title)
          title = sfObj.Type;
       end
       objSection = Section("Title",title);
       append(objSection,sfObj);
       append(section,objSection);
   end
   append(ch,section);
end
append(rpt,ch);

close(rpt);
rptview(rpt);
close_system(model);